import boto3
from botocore.exceptions import ClientError
import os
import logging
import base64

logger = logging.getLogger(__name__)

# Initialize SES client
ses_client = boto3.client(
    'ses',
    region_name=os.getenv('AWS_REGION', 'us-east-2')
)

async def send_verification_email(email: str, verification_token: str, username: str):
    """Send verification email using AWS SES"""
    verification_link = f"https://www.bthfitness.org/verify-email?token={verification_token}"
    
    subject = "Verify your BTH Fitness account"
    
    html_body = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4; }}
            .container {{ max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 8px; }}
            .header {{ text-align: center; color: #333; margin-bottom: 30px; }}
            .button {{ display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; }}
            .footer {{ font-size: 12px; color: #666; margin-top: 30px; text-align: center; }}
        </style>
    </head>
    <body>
        <div class="container">
            <h1 class="header">Welcome to BTH Fitness, {username}!</h1>
            <p>Thank you for joining our veterans community. Please verify your email address by clicking the button below:</p>
            <div style="text-align: center;">
                <a href="{verification_link}" class="button">Verify Email Address</a>
            </div>
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p><a href="{verification_link}">{verification_link}</a></p>
            <div class="footer">
                <p>If you didn't create this account, please ignore this email.</p>
                <p>This link will expire in 24 hours for security reasons.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    text_body = f"""
    Welcome to BTH Fitness, {username}!
    
    Thank you for joining our veterans community. Please verify your email address by visiting this link:
    
    {verification_link}
    
    If you didn't create this account, please ignore this email.
    This link will expire in 24 hours for security reasons.
    """
    
    try:
        response = ses_client.send_email(
            Source='noreply@bthfitness.org',
            Destination={'ToAddresses': [email]},
            Message={
                'Subject': {'Data': subject, 'Charset': 'UTF-8'},
                'Body': {
                    'Text': {'Data': text_body, 'Charset': 'UTF-8'},
                    'Html': {'Data': html_body, 'Charset': 'UTF-8'}
                }
            }
        )
        logger.info(f"Verification email sent to {email}, MessageId: {response['MessageId']}")
        return True
        
    except ClientError as e:
        logger.error(f"Failed to send email to {email}: {e}")
        return False


async def send_welcome_email_with_pdf(email: str, username: str, pdf_path: str = "BTH Ebook.pdf"):
    """Send welcome email with PDF download link"""
    
    # Your existing S3 URL - PDF already uploaded
    pdf_url = "https://bth-fitness-bucket.s3.us-east-2.amazonaws.com/resources/BTH%20Ebook.pdf"
    
    subject = "Welcome to BTH Fitness - Your Free eBook"
    
    html_body = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4; }}
            .container {{ max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 8px; }}
            .header {{ text-align: center; color: #333; margin-bottom: 30px; }}
            .content {{ line-height: 1.6; color: #555; }}
            .footer {{ font-size: 12px; color: #666; margin-top: 30px; text-align: center; }}
            .highlight {{ background-color: #f0f8ff; padding: 20px; border-left: 4px solid #007bff; margin: 20px 0; text-align: center; }}
            .button {{ display: inline-block; padding: 14px 28px; background-color: #007bff; color: white; text-decoration: none; border-radius: 6px; margin: 15px 0; font-weight: bold; font-size: 16px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <h1 class="header">Welcome to BTH Fitness, {username}!</h1>
            <div class="content">
                <p>Your email has been successfully verified. Thank you for joining our veterans community!</p>
                <div class="highlight">
                    <h3 style="margin-top: 0; color: #007bff;">📚 Your Free eBook is Ready!</h3>
                    <p>We've prepared an important resource document for you.</p>
                    <a href="{pdf_url}" class="button">Download Your eBook</a>
                    <p style="font-size: 12px; color: #666; margin-top: 10px;">Click the button above to download your copy</p>
                </div>
                <p>We're excited to have you as part of our community. Here's what you can do next:</p>
                <ul>
                    <li>Complete your profile</li>
                    <li>Connect with other veterans</li>
                    <li>Explore fitness resources</li>
                    <li>Join community groups</li>
                </ul>
                <p>If you have any questions, feel free to reach out to our support team.</p>
            </div>
            <div class="footer">
                <p>Thank you for being part of BTH Fitness!</p>
                <p style="color: #999; font-size: 11px;">BTH Fitness - Veterans Community</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    text_body = f"""
    Welcome to BTH Fitness, {username}!
    
    Your email has been successfully verified. Thank you for joining our veterans community!
    
    📚 Your Free eBook is Ready!
    
    Download your copy here: {pdf_url}
    
    What you can do next:
    - Complete your profile
    - Connect with other veterans
    - Explore fitness resources
    - Join community groups
    
    If you have any questions, feel free to reach out to our support team.
    
    Thank you for being part of BTH Fitness!
    """
    
    try:
        response = ses_client.send_email(
            Source='noreply@bthfitness.org',
            Destination={'ToAddresses': [email]},
            Message={
                'Subject': {'Data': subject, 'Charset': 'UTF-8'},
                'Body': {
                    'Text': {'Data': text_body, 'Charset': 'UTF-8'},
                    'Html': {'Data': html_body, 'Charset': 'UTF-8'}
                }
            }
        )
        
        logger.info(f"Welcome email with PDF link sent to {email}, MessageId: {response['MessageId']}")
        return True
        
    except ClientError as e:
        logger.error(f"Failed to send welcome email to {email}: {e}")
        return False
    except Exception as e:
        logger.error(f"Unexpected error sending welcome email to {email}: {e}")
        return False

async def send_password_reset_email(email: str, reset_token: str, username: str):
    """Send password reset email using AWS SES"""
    reset_link = f"https://www.bthfitness.org/reset-password?token={reset_token}"
    
    subject = "Reset your BTH Fitness password"
    
    html_body = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4; }}
            .container {{ max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 8px; }}
            .header {{ text-align: center; color: #333; margin-bottom: 30px; }}
            .button {{ display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; }}
            .footer {{ font-size: 12px; color: #666; margin-top: 30px; text-align: center; }}
            .warning {{ background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }}
        </style>
    </head>
    <body>
        <div class="container">
            <h1 class="header">Reset Your Password</h1>
            <p>Hi {username},</p>
            <p>We received a request to reset your BTH Fitness password. Click the button below to create a new password:</p>
            <div style="text-align: center;">
                <a href="{reset_link}" class="button">Reset Password</a>
            </div>
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p><a href="{reset_link}">{reset_link}</a></p>
            <div class="warning">
                <strong>⚠️ Security Notice:</strong>
                <p style="margin: 5px 0 0 0;">If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>
            </div>
            <div class="footer">
                <p>This link will expire in 1 hour for security reasons.</p>
                <p>© BTH Fitness - Veterans Community</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    text_body = f"""
    Reset Your Password
    
    Hi {username},
    
    We received a request to reset your BTH Fitness password. Visit this link to create a new password:
    
    {reset_link}
    
    ⚠️ Security Notice:
    If you didn't request this password reset, please ignore this email. Your password will remain unchanged.
    
    This link will expire in 1 hour for security reasons.
    
    © BTH Fitness - Veterans Community
    """
    
    try:
        response = ses_client.send_email(
            Source='noreply@bthfitness.org',
            Destination={'ToAddresses': [email]},
            Message={
                'Subject': {'Data': subject, 'Charset': 'UTF-8'},
                'Body': {
                    'Text': {'Data': text_body, 'Charset': 'UTF-8'},
                    'Html': {'Data': html_body, 'Charset': 'UTF-8'}
                }
            }
        )
        logger.info(f"Password reset email sent to {email}, MessageId: {response['MessageId']}")
        return True
        
    except ClientError as e:
        logger.error(f"Failed to send password reset email to {email}: {e}")
        return False