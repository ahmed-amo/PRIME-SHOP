import AuthLayoutTemplate from '@/layouts/auth/auth-split-layout';

export default function AuthLayout({ children, title, description, ...props }: { children: React.ReactNode; title: string; description: string }) {
    return (
        <div className='bg-white'>
        <AuthLayoutTemplate title={title} description={description} {...props} >
            {children}
        </AuthLayoutTemplate>
        </div>

    );
}
