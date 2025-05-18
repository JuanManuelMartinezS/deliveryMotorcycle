import React from 'react';

interface ChatAvatarProps {
  isSpeaking: boolean;
}

const ChatAvatar: React.FC<ChatAvatarProps> = ({ isSpeaking }) => {
  return (
    <div className="relative">
      {/* Avatar principal */}
      <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full p-2 shadow-lg border-4 border-white relative overflow-hidden">
        {/* Cara del robot */}
        <div className="w-full h-full bg-white rounded-full flex flex-col items-center justify-center p-4">
          {/* Ojos */}
          <div className="flex space-x-4 mb-2">
            <div className={`w-4 h-4 bg-blue-600 rounded-full ${isSpeaking ? 'animate-bounce' : ''}`} style={{ animationDelay: '0ms' }}></div>
            <div className={`w-4 h-4 bg-blue-600 rounded-full ${isSpeaking ? 'animate-bounce' : ''}`} style={{ animationDelay: '150ms' }}></div>
          </div>
          
          {/* Boca */}
          <div className="w-12 h-6 flex items-center justify-center">
            {isSpeaking ? (
              <div className="flex space-x-1">
                <div className="w-1.5 h-4 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-1.5 h-4 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-1.5 h-4 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            ) : (
              <div className="w-8 h-2 bg-blue-600 rounded-full"></div>
            )}
          </div>
        </div>

        {/* Antenas */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex space-x-8">
          <div className="w-1 h-4 bg-blue-600 rounded-full transform -rotate-12 origin-bottom"></div>
          <div className="w-1 h-4 bg-blue-600 rounded-full transform rotate-12 origin-bottom"></div>
        </div>

        {/* Puntos de las antenas */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex space-x-8">
          <div className="w-2 h-2 bg-blue-400 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="w-2 h-2 bg-blue-400 rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
        </div>
      </div>

      {/* Efecto de brillo cuando habla */}
      {isSpeaking && (
        <>
          <div className="absolute inset-0 rounded-full animate-pulse bg-blue-400 opacity-20"></div>
          {/* Ondas de sonido */}
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-1">
            <div className="w-1.5 h-6 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-1.5 h-6 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-1.5 h-6 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatAvatar; 