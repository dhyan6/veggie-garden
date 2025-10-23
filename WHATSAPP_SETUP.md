# WhatsApp Setup Guide for Twilio

## Step 1: Enable WhatsApp Sandbox (Quick Testing)

For immediate testing, use Twilio's WhatsApp Sandbox (no approval needed):

1. **Go to Twilio Console WhatsApp Sandbox**: https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn
2. **Join the Sandbox**:
   - Open WhatsApp on your phone
   - Send a message to the number shown (usually **+1 415-523-8886**)
   - Send the exact code shown (e.g., "join <your-code>")
   - You'll get a confirmation message
3. **Copy your Sandbox WhatsApp Number**: It will be something like `+14155238886`

## Step 2: Update GitHub Secrets

Go to: https://github.com/dhyan6/veggie-garden/settings/secrets/actions

**Update or add this secret:**

| Secret Name | Value | Example |
|-------------|-------|---------|
| `TWILIO_WHATSAPP_NUMBER` | Sandbox WhatsApp number | `+14155238886` |
| `TO_PHONE_NUMBER` | Your phone (same as before) | `+12133708949` |

**Keep these existing secrets:**
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`

## Step 3: Test It!

Run the test script:
```bash
cd "/Users/dhyanadlerbelendez/Desktop/T564A/Week 2/veggie-garden"
./test-sms.sh
```

You should receive a WhatsApp message with your shopping list!

---

## Production Setup (Optional - For Real WhatsApp Number)

If you want to use your own WhatsApp Business number (not sandbox):

1. **Apply for WhatsApp Business**: https://console.twilio.com/us1/develop/sms/settings/whatsapp-sender-registration
2. **Register your business** (requires Facebook Business Manager)
3. **Get approved** (takes 1-3 business days)
4. **Update `TWILIO_WHATSAPP_NUMBER`** secret with your approved number

---

## Benefits of WhatsApp over SMS:
- ✅ **No recipient verification needed** (unlike SMS trial)
- ✅ **Rich formatting** (bold, italics, emojis work better)
- ✅ **Free within trial credit**
- ✅ **Better delivery rates**
- ✅ **Multimedia support** (images, videos, etc.)
