// src/components/map/IslandAvatar.tsx
import React from 'react';
import { MarieAvatar } from './avatars/MarieAvatar';
import { KirillAvatar } from './avatars/KirillAvatar';
import { SonyaAvatar } from './avatars/SonyaAvatar';
import { CharacterId } from '../../data/islands';

interface IslandAvatarProps {
  character?: CharacterId;
  size?: number;
  className?: string;
}

export const IslandAvatar: React.FC<IslandAvatarProps> = ({ character, size = 90, className = '' }) => {
  if (character === 'marie') {
    return <MarieAvatar size={size} className={className} />;
  }
  if (character === 'kirill') {
    return <KirillAvatar size={size} className={className} />;
  }
  if (character === 'sonya') {
    return <SonyaAvatar size={size} className={className} />;
  }
  return null;
};
