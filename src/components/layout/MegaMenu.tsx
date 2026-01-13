'use client'

import * as React from "react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

// Mega menu inspirado no padrão do Minted (colunas + destaque visual)
const ListItem = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<"a"> & { title: string }
>(({ className, title, children, ...props }, ref) => (
  <li>
    <NavigationMenuLink asChild>
      <a
        ref={ref}
        className={cn(
          "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors",
          "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
          className
        )}
        {...props}
      >
        <div className="text-sm font-medium leading-none font-playfair">{title}</div>
        {children ? (
          <p className="line-clamp-2 text-sm text-muted-foreground">{children}</p>
        ) : null}
      </a>
    </NavigationMenuLink>
  </li>
));
ListItem.displayName = "ListItem";

const MegaMenu = () => {
  return (
    <NavigationMenu>
      <NavigationMenuList>

        {/* Papelaria */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="font-playfair">Papelaria</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 md:w-[600px] lg:w-[800px] lg:grid-cols-2">
              <ListItem href="/loja" title="Cartões de agradecimento">
                Kits coordenados com envelopes e opções de personalização.
              </ListItem>
              <ListItem href="/loja" title="Convites infantis">
                Temas lúdicos e cores suaves para celebrar em família.
              </ListItem>
              <ListItem href="/loja" title="Etiquetas e tags">
                Detalhes que elevam a apresentação de presentes e lembranças.
              </ListItem>
              <ListItem href="/loja" title="Embalagens e laços">
                Toque final com papéis, fitas e selos de cera.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Arte */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="font-playfair">Arte</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 md:w-[600px] lg:w-[800px] lg:grid-cols-2">
              <ListItem href="/loja" title="Fine Art Prints">
                Obras autorais impressas em papéis de museu com alta durabilidade.
              </ListItem>
              <ListItem href="/loja" title="Fotografia">
                Seleção curada de fotógrafos independentes.
              </ListItem>
              <ListItem href="/loja" title="Infantil/Quarto do bebê">
                Arte delicada para compor ambientes aconchegantes.
              </ListItem>
              <ListItem href="/loja" title="Mapas e tipografia">
                Estilos gráficos, tipográficos e mapas decorativos.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Presentes */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="font-playfair">Presentes</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 md:w-[600px] lg:w-[800px] lg:grid-cols-2">
              <ListItem href="/loja" title="Personalizados">
                Itens com monograma, nomes e datas especiais.
              </ListItem>
              <ListItem href="/loja" title="Para casa">
                Presentes decorativos com design atemporal.
              </ListItem>
              <ListItem href="/loja" title="Para crianças">
                Presentes criativos e divertidos para os pequenos.
              </ListItem>
              <ListItem href="/loja" title="Gift cards">
                Presenteie com liberdade de escolha.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Ocasiões (atalhos) */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="font-playfair">Ocasiões</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-2 p-4 md:w-[480px] lg:w-[640px] lg:grid-cols-2">
              <ListItem href="/convites" title="Casamento">Tudo para o grande dia</ListItem>
              <ListItem href="/loja" title="Aniversário">Celebre em qualquer idade</ListItem>
              <ListItem href="/loja" title="Nascimento/Batizado">Chegada e celebrações</ListItem>
              <ListItem href="/loja" title="Datas sazonais">Natal, Páscoa e mais</ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default MegaMenu;
