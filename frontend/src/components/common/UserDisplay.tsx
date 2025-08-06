import { useUser } from '@/lib/hooks/use-users';
import { User } from 'lucide-react';

interface UserDisplayProps {
  userId: string;
  showAvatar?: boolean;
  className?: string;
  fallback?: string;
}

export const UserDisplay = ({ 
  userId, 
  showAvatar = false, 
  className = "",
  fallback = "Unknown Author"
}: UserDisplayProps) => {
  const { data: user, isLoading, error } = useUser(userId);

  if (isLoading) {
    return (
      <div className={`flex items-center ${className}`}>
        {showAvatar && (
          <div className="w-4 h-4 bg-muted rounded-full animate-pulse mr-1" />
        )}
        <div className="h-3 w-16 bg-muted rounded animate-pulse" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className={`flex items-center text-muted-foreground ${className}`}>
        {showAvatar && <User className="w-4 h-4 mr-1" />}
        <span>{fallback}</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center ${className}`}>
      {showAvatar && (
        <div className="w-4 h-4 bg-primary/20 rounded-full flex items-center justify-center mr-1">
          <User className="w-3 h-3 text-primary" />
        </div>
      )}
      <span>{user.fullName}</span>
    </div>
  );
};

export default UserDisplay;
