# GitHub Secrets Setup - Quick Reference

Based on your Twilio screenshot, here are the exact GitHub secrets you need to add:

## Go to: https://github.com/dhyan6/veggie-garden/settings/secrets/actions

Click "New repository secret" for each of these:

---

### Secret 1: TWILIO_ACCOUNT_SID
- **Value**: Your Account SID from Twilio Console Dashboard
- **Where to find it**: https://console.twilio.com/ (top of page, starts with "AC...")
- **Example**: `AC1234567890abcdef1234567890abcd`

---

### Secret 2: TWILIO_AUTH_TOKEN
- **Value**: Your Auth Token from Twilio Console Dashboard
- **Where to find it**: https://console.twilio.com/ (click "Show" to reveal)
- **Example**: `1234567890abcdef1234567890abcdef`

---

### Secret 3: TWILIO_WHATSAPP_NUMBER
- **Value**: `+14155238886`
- **Note**: This is the Twilio WhatsApp Sandbox number (same for everyone)

---

### Secret 4: TO_PHONE_NUMBER
- **Value**: `+12133708949`
- **Note**: This is YOUR phone number (already joined the sandbox as shown in screenshot)

---

## After Adding All 4 Secrets:

Run this test:
```bash
cd "/Users/dhyanadlerbelendez/Desktop/T564A/Week 2/veggie-garden"
./test-sms.sh
```

You should receive a WhatsApp message within 30 seconds!

---

## Troubleshooting:

If you don't receive the message:

1. **Check GitHub Actions**: https://github.com/dhyan6/veggie-garden/actions
   - Look for "Send WhatsApp Shopping List" workflow
   - Click on it to see logs and any errors

2. **Verify you joined sandbox**:
   - Your number should show in: https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn
   - Shows as: `whatsapp:+12133708949` ✅ (You're good!)

3. **Check Twilio logs**: https://console.twilio.com/us1/monitor/logs/sms
   - See message status (queued → sent → delivered)
