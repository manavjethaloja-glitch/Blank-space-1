import React from 'react';

export default function Community() {
  return (
    <div className="min-h-screen p-8 bg-gradient-to-b from-[#050505] to-[#07101a] text-white">
      <div className="max-w-5xl mx-auto">
        <h1 className="font-serif text-4xl mb-4">Community • #BlankSpaceStyle</h1>
        <p className="text-sm text-zinc-400 mb-6">Share your looks and join the movement. Post photos with #BlankSpaceStyle to be featured.</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-56 bg-zinc-900 rounded-lg overflow-hidden">
              <img src={`https://picsum.photos/seed/bs${i}/600/600`} alt={`post-${i}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
