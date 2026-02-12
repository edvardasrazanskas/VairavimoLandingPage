export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="border-t border-[var(--color-border)] py-8 px-4">
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[var(--color-muted)]">
                <div className="flex items-center gap-2">
                    <span className="gradient-text font-bold text-base">
                        Vairavimas
                    </span>
                </div>
                <p>© {year} Vairavimas. Visos teisės saugomos.</p>
            </div>
        </footer>
    );
}
