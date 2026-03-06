#!/usr/bin/env python3
"""
Quick script to update GROQ_API_KEY in .env file
Usage: python update_groq_key.py your_api_key_here
"""

import sys
import os

def update_groq_key(api_key):
    """Update GROQ_API_KEY in .env file"""
    env_file = '.env'
    
    # Check if .env exists
    if not os.path.exists(env_file):
        print("❌ Error: .env file not found!")
        print("Creating new .env file...")
        # Create basic .env file
        with open(env_file, 'w') as f:
            f.write("# Supabase Configuration\n")
            f.write("SUPABASE_URL")
            f.write("SUPABASE_KEY")
            f.write("\n# GROQ API Key\n")
    
    # Read existing .env file
    with open(env_file, 'r') as f:
        lines = f.readlines()
    
    # Update or add GROQ_API_KEY
    updated = False
    new_lines = []
    for line in lines:
        if line.startswith('GROQ_API_KEY='):
            new_lines.append(f'GROQ_API_KEY={api_key}\n')
            updated = True
        else:
            new_lines.append(line)
    
    # If not found, add it at the end
    if not updated:
        new_lines.append(f'\n# GROQ API Key\n')
        new_lines.append(f'GROQ_API_KEY={api_key}\n')
    
    # Write back to file
    with open(env_file, 'w') as f:
        f.writelines(new_lines)
    
    print(f"✅ Successfully updated GROQ_API_KEY in .env file!")
    print(f"🔑 Key: {api_key[:10]}...{api_key[-4:]}")
    print("\n📝 Next step: Restart your backend server!")

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python update_groq_key.py <your_groq_api_key>")
        print("\nExample:")
        print("  python update_groq_key.py gsk_xxxxxxxxxxxxxxxxxxxxx")
        sys.exit(1)
    
    api_key = sys.argv[1].strip()
    
    # Basic validation
    if not api_key.startswith('gsk_'):
        print("⚠️  Warning: API key should start with 'gsk_'")
        response = input("Continue anyway? (y/n): ")
        if response.lower() != 'y':
            sys.exit(1)
    
    update_groq_key(api_key)


