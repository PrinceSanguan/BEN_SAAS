import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { type User } from '@/types';

// Make sure to export this function as a named export
export function UserInfo({ user, showEmail = false }: { user: User; showEmail?: boolean }) {
    // Get initials from username for the avatar fallback
    const getInitials = (name: string): string => {
        return name
            .split(' ')
            .map((part) => part.charAt(0))
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    const username: string = (user?.username as string) || 'Guest';
    const initials = getInitials(username);

    return (
        <>
            <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                <AvatarImage src={(user?.avatar as string) || ''} alt={username} />
                <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">{initials}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{username}</span>
                {showEmail && <span className="text-muted-foreground truncate text-xs">{user?.email || ''}</span>}
            </div>
        </>
    );
}
