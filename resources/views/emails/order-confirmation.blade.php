<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Order Confirmation</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;">

          {{-- Header --}}
          <tr>
            <td style="background:#f97316;padding:32px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:28px;font-weight:bold;">Prime SH</h1>
              <p style="color:#fff7ed;margin:8px 0 0;">Order Confirmation</p>
            </td>
          </tr>

          {{-- Greeting --}}
          <tr>
            <td style="padding:32px;">
              <h2 style="color:#111827;margin:0 0 8px;">Thank you, {{ $order->user->name }}! 🎉</h2>
              <p style="color:#6b7280;margin:0;">Your order has been placed successfully. Here's a summary:</p>

              {{-- Order Meta --}}
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;background:#f9fafb;border-radius:6px;padding:16px;">
                <tr>
                  <td style="color:#6b7280;font-size:14px;">Order Number</td>
                  <td style="color:#111827;font-weight:bold;text-align:right;">#{{ $order->id }}</td>
                </tr>
                <tr>
                  <td style="color:#6b7280;font-size:14px;padding-top:8px;">Date</td>
                  <td style="color:#111827;text-align:right;padding-top:8px;">{{ $order->created_at->format('M d, Y') }}</td>
                </tr>
                <tr>
                  <td style="color:#6b7280;font-size:14px;padding-top:8px;">Status</td>
                  <td style="text-align:right;padding-top:8px;">
                    <span style="background:#f97316;color:#fff;padding:2px 10px;border-radius:99px;font-size:12px;">
                      {{ ucfirst($order->status) }}
                    </span>
                  </td>
                </tr>
              </table>

              {{-- Items Table --}}
              <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                <thead>
                  <tr style="background:#f97316;">
                    <th style="color:#fff;padding:10px 12px;text-align:left;font-size:13px;">Product</th>
                    <th style="color:#fff;padding:10px 12px;text-align:center;font-size:13px;">Qty</th>
                    <th style="color:#fff;padding:10px 12px;text-align:right;font-size:13px;">Unit Price</th>
                    <th style="color:#fff;padding:10px 12px;text-align:right;font-size:13px;">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  @foreach($order->items as $item)
                  <tr style="border-bottom:1px solid #f3f4f6;">
                    <td style="padding:12px;color:#111827;font-size:14px;">{{ $item->product->name }}</td>
                    <td style="padding:12px;color:#6b7280;text-align:center;font-size:14px;">{{ $item->quantity }}</td>
                    <td style="padding:12px;color:#6b7280;text-align:right;font-size:14px;">${{ number_format($item->unit_price, 2) }}</td>
                    <td style="padding:12px;color:#111827;font-weight:bold;text-align:right;font-size:14px;">${{ number_format($item->quantity * $item->unit_price, 2) }}</td>
                  </tr>
                  @endforeach
                </tbody>
                <tfoot>
                  <tr>
                    <td colspan="3" style="padding:16px 12px;text-align:right;font-weight:bold;color:#111827;">Total</td>
                    <td style="padding:16px 12px;text-align:right;font-weight:bold;color:#f97316;font-size:18px;">${{ number_format($order->total, 2) }}</td>
                  </tr>
                </tfoot>
              </table>

              {{-- PDF Note --}}
              <p style="color:#6b7280;font-size:13px;margin:24px 0 0;padding:16px;background:#f9fafb;border-radius:6px;text-align:center;">
                📎 Your invoice is attached to this email as a PDF.
              </p>
            </td>
          </tr>

          {{-- Footer --}}
          <tr>
            <td style="background:#f9fafb;padding:24px;text-align:center;border-top:1px solid #f3f4f6;">
              <p style="color:#9ca3af;font-size:12px;margin:0;">Thank you for shopping with Prime SH</p>
              <p style="color:#9ca3af;font-size:12px;margin:4px 0 0;">If you have any questions, reply to this email.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
