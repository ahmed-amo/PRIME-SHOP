<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Invoice #{{ $order->id }}</title>
  <style>
    body { font-family: Arial, sans-serif; color: #111827; margin: 0; padding: 40px; }
    .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
    .shop-name { font-size: 28px; font-weight: bold; color: #f97316; }
    .invoice-title { font-size: 32px; font-weight: bold; color: #111827; text-align: right; }
    .invoice-meta { text-align: right; color: #6b7280; font-size: 13px; margin-top: 4px; }
    .divider { border: none; border-top: 2px solid #f3f4f6; margin: 24px 0; }
    .customer { margin-bottom: 32px; }
    .customer h4 { color: #6b7280; font-size: 11px; text-transform: uppercase; margin: 0 0 6px; }
    .customer p { margin: 0; font-size: 14px; }
    table { width: 100%; border-collapse: collapse; margin-top: 8px; }
    thead tr { background: #f97316; }
    thead th { color: #fff; padding: 10px 12px; text-align: left; font-size: 13px; }
    tbody tr { border-bottom: 1px solid #f3f4f6; }
    tbody td { padding: 12px; font-size: 13px; color: #374151; }
    .text-right { text-align: right; }
    .text-center { text-align: center; }
    .total-row td { font-weight: bold; padding: 16px 12px; font-size: 15px; }
    .total-amount { color: #f97316; font-size: 18px; }
    .footer { margin-top: 48px; text-align: center; color: #9ca3af; font-size: 12px; border-top: 1px solid #f3f4f6; padding-top: 24px; }
  </style>
</head>
<body>

  <div class="header">
    <div class="shop-name">Prime SH</div>
    <div>
      <div class="invoice-title">INVOICE</div>
      <div class="invoice-meta">#{{ $order->id }}</div>
      <div class="invoice-meta">{{ $order->created_at->format('M d, Y') }}</div>
    </div>
  </div>

  <hr class="divider">

  <div class="customer">
    <h4>Billed To</h4>
    <p>{{ $order->user->name }}</p>
    <p>{{ $order->user->email }}</p>
  </div>

  <table>
    <thead>
      <tr>
        <th>Product</th>
        <th class="text-center">Qty</th>
        <th class="text-right">Unit Price</th>
        <th class="text-right">Subtotal</th>
      </tr>
    </thead>
    <tbody>
      @foreach($order->items as $item)
      <tr>
        <td>{{ $item->product->name }}</td>
        <td class="text-center">{{ $item->quantity }}</td>
        <td class="text-right">${{ number_format($item->unit_price, 2) }}</td>
        <td class="text-right">${{ number_format($item->quantity * $item->unit_price, 2) }}</td>
      </tr>
      @endforeach
    </tbody>
    <tfoot>
      <tr class="total-row">
        <td colspan="3" class="text-right">Total</td>
        <td class="text-right total-amount">${{ number_format($order->total, 2) }}</td>
      </tr>
    </tfoot>
  </table>

  <div class="footer">
    Thank you for your purchase — Prime SH
  </div>

</body>
</html>
