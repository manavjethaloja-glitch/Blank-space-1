import React from 'react';
import { Home, Search, Tag, Heart, User } from 'lucide-react';

export default function BottomNav() {
  return (
    <nav className="bs-bottom-nav md:hidden">
      <a href="#/" className="flex flex-col items-center text-[11px]"><Home className="w-5 h-5"/><span>Home</span></a>
      <a href="#/shop" className="flex flex-col items-center text-[11px]"><Search className="w-5 h-5"/><span>Discover</span></a>
      <a href="#/drops" className="flex flex-col items-center text-[11px]"><Tag className="w-5 h-5"/><span>Drops</span></a>
      <a href="#/wishlist" className="flex flex-col items-center text-[11px]"><Heart className="w-5 h-5"/><span>Wishlist</span></a>
      <a href="#/account" className="flex flex-col items-center text-[11px]"><User className="w-5 h-5"/><span>Profile</span></a>
    </nav>
  );
}
