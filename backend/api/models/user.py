# api/models/user.py
from fastapi import UploadFile
from pydantic import BaseModel, EmailStr, validator
from typing import Optional, List
from decimal import Decimal

class UserCreate(BaseModel):
    firstName: str
    lastName: str 
    username: str
    password: Optional[str] = None
    email: Optional[EmailStr] = None
    phoneNumber: Optional[str] = None
    interests: Optional[List[str]] = None
    employmentStatus: Optional[str] = None  # No longer required
    workLocation: Optional[str] = None  # No longer required
    liveState: Optional[str] = None
    liveLocation: Optional[str] = None  # Conditionally required based on state
    isVeteran: bool
    weight: Optional[Decimal] = None  # No longer required
    height: Optional[Decimal] = None  # No longer required
    profilePic: Optional[str] = None
    agreedToDisclosures: Optional[bool]
    email_verified: Optional[bool] = False
    
    # States that require city/liveLocation
    STATES_REQUIRING_CITY = ['Pennsylvania']
    
    @validator('liveState', always=True)
    def validate_live_state(cls, v, values):
        """Validate that liveState is provided for veterans"""
        if values.get('isVeteran') and not v:
            raise ValueError('State/Territory is required for veterans.')
        return v
    
    @validator('liveLocation', always=True)
    def validate_live_location(cls, v, values):
        """Validate liveLocation only for specific states"""
        if values.get('isVeteran'):
            live_state = values.get('liveState')
            if live_state in cls.STATES_REQUIRING_CITY and not v:
                raise ValueError(f'City is required for veterans in {live_state}.')
        return v
    
    @validator('height', 'weight', always=True)
    def validate_positive_numbers(cls, v, field):
        """Validate that height and weight are positive if provided"""
        if v is not None and v <= 0:
            raise ValueError(f'{field.name} must be a positive number.')
        return v

class UserResponse(BaseModel):
    username: Optional[str]
    firstName: Optional[str]
    lastName: Optional[str]
    email: Optional[str]
    phoneNumber: Optional[str]
    isVeteran: Optional[bool]
    employmentStatus: Optional[str]
    workLocation: Optional[str]
    liveState: Optional[str]  # Fixed typo: was workState
    liveLocation: Optional[str]
    height: Optional[int]  # Height in inches
    weight: Optional[int]
    profilePic: Optional[str]
    agreedToDisclosures: Optional[bool]
    email_verified: Optional[bool] = False
    
    @validator('height', 'weight', pre=True, always=True)
    def convert_decimal_to_int(cls, v):
        if isinstance(v, Decimal):
            return int(v)
        return v

class ProfilePicResponse(BaseModel):
    profilePic: Optional[str]

class LoginRequest(BaseModel):
    username: str
    password: str

# UserUpdateRequest model for updating user data
class UserUpdateRequest(BaseModel):
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    password: Optional[str] = None
    email: Optional[EmailStr] = None
    phoneNumber: Optional[str] = None
    interests: Optional[List[str]] = None
    employmentStatus: Optional[str] = None
    workLocation: Optional[str] = None
    liveState: Optional[str] = None
    liveLocation: Optional[str] = None
    isVeteran: Optional[bool] = None
    weight: Optional[Decimal] = None
    height: Optional[Decimal] = None
    profilePic: Optional[UploadFile] = None
    agreedToDisclosures: Optional[bool] = None
    
    # States that require city/liveLocation
    STATES_REQUIRING_CITY = ['Pennsylvania']
    
    @validator('liveLocation', always=True)
    def validate_live_location(cls, v, values):
        """Validate liveLocation only for specific states when updating"""
        if values.get('isVeteran'):
            live_state = values.get('liveState')
            # Only validate if liveState is being updated to a state requiring city
            if live_state in cls.STATES_REQUIRING_CITY and not v:
                raise ValueError(f'City is required for veterans in {live_state}.')
        return v
    
    @validator('height', 'weight', always=True)
    def validate_positive_numbers(cls, v, field):
        """Validate that height and weight are positive if provided"""
        if v is not None and v <= 0:
            raise ValueError(f'{field.name} must be a positive number.')
        return v