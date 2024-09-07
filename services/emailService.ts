import { Mongoose } from 'mongoose'

// 发送邮件的函数
async function sendEmail(to: string, subject: string, body: string) {
    const apiUrl = `https://api.beehiiv.com/v2/publications/${process.env.BEEHIIV_PUBLICATION_ID}/emails`
    const apiKey = process.env.BEEHIIV_API_KEY

    const emailData = {
        to,
        subject,
        body
    }

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(emailData)
        })

        if (!response.ok) {
            throw new Error('Email sending failed')
        }
    } catch (error) {
        console.error('Error sending email:', error)
        throw new Error('Email sending failed')
    }
}

// ... existing code ...