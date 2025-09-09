import React, { useState } from 'react';
import { useTranslation } from '../i18n';
import QrCodePdfIcon from './icons/QrCodesDownloadIcon';
import QuestionMarkIcon from './icons/QuestionMarkIcon';
import LockIcon from './icons/LockIcon';
import Spinner from './Spinner';

import './PlaylistComponent.css';

export type PlaylistItem = {
  id: string;
  name: string;
  tracks?: number;
  playlistImage?: { url: string };
  public?: boolean;
};

type PlaylistComponentProps = {
  children?: React.ReactNode;
  title?: string;
  playlists: Record<string, PlaylistItem>;
  loading?: boolean;
  onGenerate: (items: string[]) => void;
  isGenerating: boolean;
  selectionEnabled?: boolean;
};

const PlaylistComponent: React.FC<PlaylistComponentProps> = ({
  title,
  playlists,
  loading,
  onGenerate,
  isGenerating,
  selectionEnabled = true,
  children,
}) => {
  const { t } = useTranslation();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isSelectionMode, setSelectionMode] = useState(false);

  const toggleSelectionMode = () => {
    if (isSelectionMode) setSelectedItems([]);
    setSelectionMode(!isSelectionMode);
  };

  const toggleSelectItem = (id: string) => {
    setSelectedItems((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const generateItem = (id: string) => {
    onGenerate([id]);
  };

  const generateSelected = () => {
    onGenerate(selectedItems);
  };

  const resetSelection = () => setSelectedItems([]);

  return (
    <div className="playlist-container">
      {title && <p className="playlist-title">{title}</p>}

      {selectionEnabled && (
        <button className="select-button" onClick={toggleSelectionMode} disabled={isGenerating}>
          {isSelectionMode ? t('cancelSelection') : t('selectPlaylists')}
        </button>
      )}

      <ul className="playlist-list">
        {Object.entries(playlists).map(([id, item]) => (
          <li
            key={id}
            className={`playlist-item ${selectedItems.includes(id) ? 'selected' : ''} ${
              isSelectionMode ? 'hover-enabled' : ''
            }`}
            onClick={() => isSelectionMode && toggleSelectItem(id)}
          >
            {isSelectionMode && (
              <input
                type="checkbox"
                className="checkbox"
                checked={selectedItems.includes(id)}
                // onChange={() => toggleSelectItem(id)}
              />
              // <div className="checkbox">{selectedItems.includes(id) ? '☑' : '☐'}</div>
            )}

            {item?.playlistImage?.url ? (
              <img src={item.playlistImage.url} alt={item.name} className="playlist-image" />
            ) : (
              <QuestionMarkIcon className="playlist-image" style={{ padding: '12px' }} />
            )}

            <div className="playlist-info">
              <h3 className="playlist-name">
                {!item.public && (
                  <span className="lock-icon">
                    <LockIcon />
                  </span>
                )}
                {item.name}
              </h3>
              {item.tracks !== undefined && (
                <p className="playlist-tracks">
                  {item.tracks} {t('tracks')}
                </p>
              )}
            </div>

            {!isSelectionMode && (
              <QrCodePdfIcon
                className="qr-icon"
                text={t('generate')}
                onClick={(e) => {
                  e.stopPropagation();
                  generateItem(id);
                }}
                // disabled={isGenerating}
              />
            )}
          </li>
        ))}
      </ul>

      {isSelectionMode && selectedItems.length > 0 && (
        <div className="floating-actions">
          <button className="reset-button" onClick={resetSelection} disabled={isGenerating}>
            {t('resetSelection')}
          </button>
          <button
            className="generate-all-button"
            onClick={generateSelected}
            disabled={isGenerating}
          >
            {t('generateQrCodesFor')} {selectedItems.length}{' '}
            {selectedItems.length > 1 ? t('playlists') : t('playlist')}
          </button>
        </div>
      )}

      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Spinner size="50px" speed="1.0s" />
        </div>
      )}

      {children}
    </div>
  );
};

export default PlaylistComponent;
