import { NextResponse } from "next/server";
import { createUser, getUserByEmail, updateUser } from '@/lib/db'; // 假设这些函数已经在 db.ts 中实现
import { generateToken } from '@/lib/auth';
import mongoose from 'mongoose';

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(request: Request) {
  try {
    const publicationId = process.env.BEEHIIV_PUBLICATION_ID;
    const apiKey = process.env.BEEHIIV_API_KEY;

    if (!publicationId || !apiKey) {
      console.error("Missing environment variables");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const { email, username, walletAddress } = await request.json();

    console.log('email, username, walletAddress', email, username, walletAddress);
    

    if (!email || !username || !walletAddress) {
      return NextResponse.json(
        { error: "Email, username, and wallet address are required" },
        { status: 400 }
      );
    }

    // Generate JWT token
    const stoken = await generateToken({ email, address: walletAddress });

    // Create or update user in database
    let user = await getUserByEmail(email);
    if (user) {
      if (!user._id) {
        throw new Error('User found but _id is missing');
      }
      user = await updateUser(new mongoose.Types.ObjectId(user._id.toString()), { username, walletAddresses: [walletAddress], stoken });
    } else {
      user = await createUser({ 
        email, 
        username, 
        walletAddresses: [walletAddress], 
        stoken 
      } as User);
    }

    if (!user) {
      throw new Error('Failed to create or update user');
    }

    console.log(`Checking subscription status for email: ${email}`);

    // 查询当前邮件的订阅状态
    const checkUrl = `https://api.beehiiv.com/v2/publications/${publicationId}/subscriptions/by_email/${encodeURIComponent(email)}`;
    const checkResponse = await fetch(checkUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    if (checkResponse.ok) {
      const subscriptionData = (await checkResponse.json())?.data;
      console.log("Subscription status:", subscriptionData);

      if (subscriptionData.status === "active") {
        console.log("Active subscription found, attempting to update subscription status");
        // 更新订阅状态为 inactive
        const updateUrl = `https://api.beehiiv.com/v2/publications/${publicationId}/subscriptions/${subscriptionData.id}`;
        const updateResponse = await fetch(updateUrl, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ unsubscribe: true, status: "inactive" }),
        });

        if (updateResponse.ok) {
          console.log("Subscription status updated to inactive");
        } else {
          console.error("Error updating subscription status:", await updateResponse.json());
        }
      } else {
        console.log("No active subscription found, proceeding to create new subscription");
      }
    } else if (checkResponse.status !== 404) {
      console.error("Error checking subscription status:", await checkResponse.json());
    } else {
      console.log("No existing subscription found");
    }

    console.log(`Attempting to create new subscription for email: ${email}`);

    console.log('stoken', stoken);
    

    // 创建新订阅
    const createUrl = `https://api.beehiiv.com/v2/publications/${publicationId}/subscriptions`;
    const createResponse = await fetch(createUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        reactivate_existing: true,
        send_welcome_email: true,
        utm_source: "signup_page",
        custom_fields: [
          { name: "first_name", value: username },
          { name: "stoken", value: stoken }
        ],
      }),
    });

    if (!createResponse.ok) {
      const errorData = await createResponse.json().catch(() => ({}));
      console.error("Beehiiv API error:", createResponse.status, errorData);
      throw new Error(`Failed to create subscription: ${createResponse.status} ${createResponse.statusText}`);
    }

    const responseData = await createResponse.json();
    console.log("Beehiiv API response for new subscription:", responseData);

    return NextResponse.json({ message: "Subscription created successfully", stoken });
  } catch (error) {
    console.error("Error managing subscription:", error);
    return NextResponse.json({ error: "Failed to manage subscription", details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
