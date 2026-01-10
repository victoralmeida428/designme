export function Footer() {
  return (
    <footer className="border-t py-6 md:py-0 ">
      <div className="px-5 flex flex-col md:flex-row items-center justify-center gap-4 md:h-16 text-sm text-muted-foreground">
        <p>© 2025 Design Me. Todos os direitos reservados.</p>
        <div className="flex gap-4">
          <a href="#">Termos</a>
          <a href="#">Privacidade</a>
        </div>
      </div>
    </footer>
  );
}