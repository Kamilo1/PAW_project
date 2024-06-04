import { BehaviorSubject, Observable } from 'rxjs';

type ISOString = string;

interface Notification {
  id: number;
  title: string;
  message: string;
  date: ISOString;
  priority: 'low' | 'medium' | 'high';
  read: boolean;
}

class NotificationService {
  private notificationsSubject: BehaviorSubject<Notification[]> = new BehaviorSubject<Notification[]>([]);
  private unreadCountSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private nextId: number = 1;

  send(notification: Omit<Notification, 'id'>): void {
    const notifications = this.notificationsSubject.getValue();
    const newNotification: Notification = { ...notification, id: this.nextId++ };
    notifications.push(newNotification);
    this.notificationsSubject.next(notifications);
    this.updateUnreadCount();
    
    if (newNotification.priority === 'medium' || newNotification.priority === 'high') {
      this.showNotificationDialog(newNotification);
    }
  }

  list(): Observable<Notification[]> {
    return this.notificationsSubject.asObservable();
  }

  unreadCount(): Observable<number> {
    return this.unreadCountSubject.asObservable();
  }

  private updateUnreadCount(): void {
    const unreadCount = this.notificationsSubject.getValue().filter(n => !n.read).length;
    this.unreadCountSubject.next(unreadCount);
  }

  private showNotificationDialog(notification: Notification): void {
    const dialog = document.createElement('div');
    dialog.className = 'notification-dialog';
    dialog.innerHTML = `
      <h2>${notification.title}</h2>
      <p>${notification.message}</p>
      <button id="close-dialog">Zamknij</button>
    `;
    document.body.appendChild(dialog);

    document.getElementById('close-dialog')?.addEventListener('click', () => {
      document.body.removeChild(dialog);
    });
  }

  markAsRead(notificationId: number): void {
    const notifications = this.notificationsSubject.getValue();
    const notification = notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      this.notificationsSubject.next(notifications);
      this.updateUnreadCount();
    }
  }
}

export const notificationService = new NotificationService();
