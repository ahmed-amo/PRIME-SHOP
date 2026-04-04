<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Queue\SerializesModels;

class AdminNewOrderNotification extends Notification implements ShouldQueue
{
    use Queueable;
    use SerializesModels;

    public function __construct(public Order $order)
    {
    }

    /**
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database', 'mail'];
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'order_id' => $this->order->id,
            'order_number' => $this->order->order_number,
            'customer_name' => $this->order->customer_name,
            'customer_email' => $this->order->customer_email,
            'total' => (float) $this->order->total,
            'payment_method' => $this->order->payment_method,
            'status' => $this->order->status,
            'url' => route('admin.orders'),
        ];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('New order received: '.$this->order->order_number)
            ->greeting('Hello '.$notifiable->name.',')
            ->line('A new order has been placed and needs admin attention.')
            ->line('Order: '.$this->order->order_number)
            ->line('Customer: '.$this->order->customer_name.' ('.$this->order->customer_email.')')
            ->line('Payment method: '.$this->order->payment_method)
            ->action('View orders', route('admin.orders'));
    }
}
