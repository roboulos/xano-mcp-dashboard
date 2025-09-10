curl -X POST https://xnwv-v1z6-dvnr.n7c.xano.io/api:Etd0xY9r/xano-credentials/create \
  -H "Content-Type: application/json" \
  -d '{ 
    "credential_name": "", 
    "xano_api_key": "" 
  }' \
    -H "Authorization: Bearer XANOTOKEN"

curl -X DELETE https://xnwv-v1z6-dvnr.n7c.xano.io/api:Etd0xY9r/xano-credentials/delete \
  -H "Content-Type: application/json" \
  -d '{ 
    "id": 1, 
  }' \
    -H "Authorization: Bearer XANOTOKEN"

curl -X GET https://xnwv-v1z6-dvnr.n7c.xano.io/api:Etd0xY9r/xano-credentials/get-active \
  -H "Authorization: Bearer XANOTOKEN"

curl -X GET https://xnwv-v1z6-dvnr.n7c.xano.io/api:Etd0xY9r/xano-credentials/list \
  -H "Authorization: Bearer XANOTOKEN"

curl -X PUT https://xnwv-v1z6-dvnr.n7c.xano.io/api:Etd0xY9r/xano-credentials/set-default \
  -H "Content-Type: application/json" \
  -d '{ 
    "id": 1 
  }' \
  -H "Authorization: Bearer XANOTOKEN"

curl -X PATCH https://xnwv-v1z6-dvnr.n7c.xano.io/api:Etd0xY9r/xano-credentials/update \
  -H "Content-Type: application/json" \
  -d '{ 
    "id": 1,
    "credential_name": "Updated Name" 
  }' \
  -H "Authorization: Bearer XANOTOKEN"

curl -X POST https://xnwv-v1z6-dvnr.n7c.xano.io/api:Etd0xY9r/xano-credentials/validate \
  -H "Content-Type: application/json" \
  -d '{ 
    "id": 1 
  }' \
  -H "Authorization: Bearer XANOTOKEN"

curl -X POST https://xnwv-v1z6-dvnr.n7c.xano.io/api:Etd0xY9r/mcp-log \
  -H "Content-Type: application/json" \
  -d '{ 
    "mcp_tool": "xano-turbo",
    "tool_name": "list_instances",
    "url": "https://app.xano.com/api:meta/instances",
    "method": "GET",
    "user_id": 123,
    "user_email": "user@example.com",
    "duration": 250,
    "status": "success",
    "error_message": "",
    "params": {"workspace_id": 5},
    "response_size": 1024,
    "environment": "production"
  }' \
  -H "Authorization: Bearer XANOTOKEN"

# Authentication Management API

curl -X POST https://xnwv-v1z6-dvnr.n7c.xano.io/api:e6emygx3/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "company": "Acme Corp",
    "email": "john@example.com",
    "password": "securepassword123",
    "invitation_token": ""
  }'

curl -X POST https://xnwv-v1z6-dvnr.n7c.xano.io/api:e6emygx3/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepassword123"
  }'

curl -X GET https://xnwv-v1z6-dvnr.n7c.xano.io/api:e6emygx3/auth/me \
  -H "Authorization: Bearer XANOTOKEN"

curl -X POST https://xnwv-v1z6-dvnr.n7c.xano.io/api:e6emygx3/save_api_key \
  -H "Content-Type: application/json" \
  -d '{
    "api_key": "your-xano-api-key-here"
  }' \
  -H "Authorization: Bearer XANOTOKEN"

# Dashboard Analytics API

curl -X GET https://xnwv-v1z6-dvnr.n7c.xano.io/api:ZVMx4ul_/mcp-metrics/real-summary?period=week&timezone=America/New_York \
  -H "Authorization: Bearer XANOTOKEN"

curl -X GET https://xnwv-v1z6-dvnr.n7c.xano.io/api:ZVMx4ul_/daily-metrics \
  -H "Authorization: Bearer XANOTOKEN"

curl -X GET https://xnwv-v1z6-dvnr.n7c.xano.io/api:ZVMx4ul_/activity-feed?limit=50 \
  -H "Authorization: Bearer XANOTOKEN"

curl -X GET https://xnwv-v1z6-dvnr.n7c.xano.io/api:ZVMx4ul_/mcp-metrics/performance?period=week \
  -H "Authorization: Bearer XANOTOKEN"

curl -X GET https://xnwv-v1z6-dvnr.n7c.xano.io/api:ZVMx4ul_/mcp-metrics/trends?period=week&compare=true \
  -H "Authorization: Bearer XANOTOKEN"

curl -X GET https://xnwv-v1z6-dvnr.n7c.xano.io/api:ZVMx4ul_/mcp-metrics/errors \
  -H "Authorization: Bearer XANOTOKEN"

curl -X GET https://xnwv-v1z6-dvnr.n7c.xano.io/api:ZVMx4ul_/mcp-metrics/tool/list_tables?days=7 \
  -H "Authorization: Bearer XANOTOKEN"

curl -X GET https://xnwv-v1z6-dvnr.n7c.xano.io/api:ZVMx4ul_/mcp-metrics/export?days=30 \
  -H "Authorization: Bearer XANOTOKEN"

curl -X POST https://xnwv-v1z6-dvnr.n7c.xano.io/api:ZVMx4ul_/mcp-logs/cleanup \
  -H "Content-Type: application/json" \
  -d '{
    "days_to_keep": 30,
    "dry_run": true
  }' \
  -H "Authorization: Bearer XANOTOKEN"

# Stripe & Billing Management API

curl -X GET https://xnwv-v1z6-dvnr.n7c.xano.io/api:uBjgCRGU/billing/plans

curl -X POST https://xnwv-v1z6-dvnr.n7c.xano.io/api:uBjgCRGU/billing/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "price_id": "price_1234567890",
    "success_url": "https://example.com/success",
    "cancel_url": "https://example.com/cancel"
  }' \
  -H "Authorization: Bearer XANOTOKEN"

curl -X GET https://xnwv-v1z6-dvnr.n7c.xano.io/api:uBjgCRGU/billing/subscription \
  -H "Authorization: Bearer XANOTOKEN"

curl -X POST https://xnwv-v1z6-dvnr.n7c.xano.io/api:uBjgCRGU/billing/cancel \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "Too expensive"
  }' \
  -H "Authorization: Bearer XANOTOKEN"

curl -X POST https://xnwv-v1z6-dvnr.n7c.xano.io/api:uBjgCRGU/billing/reactivate \
  -H "Content-Type: application/json" \
  -d '{
    "plan_tier": "pro"
  }' \
  -H "Authorization: Bearer XANOTOKEN"

curl -X PUT https://xnwv-v1z6-dvnr.n7c.xano.io/api:uBjgCRGU/billing/upgrade \
  -H "Content-Type: application/json" \
  -d '{
    "new_plan_tier": "enterprise",
    "price_id": "price_enterprise_123"
  }' \
  -H "Authorization: Bearer XANOTOKEN"

curl -X POST https://xnwv-v1z6-dvnr.n7c.xano.io/api:uBjgCRGU/stripe/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "type": "checkout.session.completed",
    "data": {
      "object": {
        "id": "cs_test_123",
        "amount_total": 2900
      }
    }
  }'

curl -X GET https://xnwv-v1z6-dvnr.n7c.xano.io/api:uBjgCRGU/billing/invoices?page=1&per_page=10 \
  -H "Authorization: Bearer XANOTOKEN"

curl -X GET https://xnwv-v1z6-dvnr.n7c.xano.io/api:uBjgCRGU/billing/payment-methods \
  -H "Authorization: Bearer XANOTOKEN"

curl -X POST https://xnwv-v1z6-dvnr.n7c.xano.io/api:uBjgCRGU/billing/payment-methods \
  -H "Content-Type: application/json" \
  -d '{
    "payment_method_id": "pm_1234567890",
    "brand": "visa",
    "last4": "4242",
    "exp_month": 12,
    "exp_year": 2025
  }' \
  -H "Authorization: Bearer XANOTOKEN"

curl -X DELETE https://xnwv-v1z6-dvnr.n7c.xano.io/api:uBjgCRGU/billing/payment-methods/{id} \
  -H "Content-Type: application/json" \
  -d '{
    "id": "pm_1234567890"
  }' \
  -H "Authorization: Bearer XANOTOKEN"

curl -X GET https://xnwv-v1z6-dvnr.n7c.xano.io/api:uBjgCRGU/billing/usage \
  -H "Authorization: Bearer XANOTOKEN"

curl -X GET https://xnwv-v1z6-dvnr.n7c.xano.io/api:uBjgCRGU/billing/quota-status \
  -H "Authorization: Bearer XANOTOKEN"
