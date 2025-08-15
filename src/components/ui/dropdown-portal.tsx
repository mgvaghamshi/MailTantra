"use client";

import { useEffect, useState, ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface DropdownPortalProps {
  children: ReactNode;
  isOpen: boolean;
  triggerRef: React.RefObject<HTMLElement | null>;
  onClose: () => void;
}

export function DropdownPortal({ children, isOpen, triggerRef, onClose }: DropdownPortalProps) {
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);
  const [position, setPosition] = useState({ top: 0, left: 0, right: 0 });

  useEffect(() => {
    // Create or get portal container
    let container = document.getElementById('dropdown-portal');
    if (!container) {
      container = document.createElement('div');
      container.id = 'dropdown-portal';
      container.style.position = 'fixed';
      container.style.top = '0';
      container.style.left = '0';
      container.style.zIndex = '99999';
      container.style.pointerEvents = 'none';
      document.body.appendChild(container);
    }
    setPortalContainer(container);

    return () => {
      // Clean up if component unmounts
      const existingContainer = document.getElementById('dropdown-portal');
      if (existingContainer && !existingContainer.hasChildNodes()) {
        document.body.removeChild(existingContainer);
      }
    };
  }, []);

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const updatePosition = () => {
        const triggerRect = triggerRef.current!.getBoundingClientRect();
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const dropdownWidth = 256; // w-64 = 16rem = 256px
        const dropdownHeight = 400; // max height

        let top = triggerRect.bottom + 8; // 8px gap
        let left = triggerRect.right - dropdownWidth;
        let right = 'auto';

        // Check if dropdown would go off screen vertically
        if (top + dropdownHeight > windowHeight) {
          top = triggerRect.top - dropdownHeight - 8; // Show above
        }

        // Check if dropdown would go off screen horizontally
        if (left < 16) {
          left = 16; // 16px margin from left edge
          right = 'auto';
        } else if (triggerRect.right + 16 > windowWidth) {
          left = windowWidth - dropdownWidth - 16; // 16px margin from right edge
          right = 'auto';
        }

        setPosition({ top, left, right: typeof right === 'string' ? 0 : right });
      };

      updatePosition();
      window.addEventListener('scroll', updatePosition);
      window.addEventListener('resize', updatePosition);

      return () => {
        window.removeEventListener('scroll', updatePosition);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [isOpen, triggerRef]);

  useEffect(() => {
    if (isOpen) {
      const handleClickOutside = (event: MouseEvent) => {
        if (triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
          const dropdown = document.querySelector('[data-dropdown-content]');
          if (dropdown && !dropdown.contains(event.target as Node)) {
            onClose();
          }
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen || !portalContainer) {
    return null;
  }

  return createPortal(
    <div
      data-dropdown-content
      style={{
        position: 'fixed',
        top: position.top,
        left: position.left,
        width: '16rem', // w-64
        maxHeight: '400px',
        overflowY: 'auto',
        pointerEvents: 'auto',
        zIndex: 99999
      }}
      className="bg-white border border-neutral-200 rounded-xl shadow-nimbus"
    >
      {children}
    </div>,
    portalContainer
  );
}
