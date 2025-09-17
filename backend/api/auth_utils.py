from fastapi import HTTPException
from api.db_setup import dynamodb
from boto3.dynamodb.conditions import Key
import logging

logger = logging.getLogger(__name__)
users_table = dynamodb.Table('users')

async def require_email_verification(username: str):
    """
    Check if user's email is verified. Raise HTTPException if not.
    """
    try:
        response = users_table.get_item(Key={'username': username})
        
        if 'Item' not in response:
            raise HTTPException(status_code=404, detail="User not found")
        
        user = response['Item']
        
        # If user has email but it's not verified
        if user.get('email') and not user.get('email_verified', False):
            raise HTTPException(
                status_code=403, 
                detail="Email verification required. Please check your email for verification link."
            )
            
        return True
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error checking email verification for {username}: {e}")
        raise HTTPException(status_code=500, detail="Failed to verify user status")

def get_user_from_token(user_data: dict):
    """
    Extract username from authenticated user data.
    Assumes you're using the login_manager dependency.
    """
    return user_data.get('username')