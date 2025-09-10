import React, { useState } from 'react';
import { Volume2, Music, Settings, Play, Pause } from 'lucide-react';
import notificationService from '../services/notificationService';

const SoundCustomizer: React.FC = () => {
  const [currentConfig, setCurrentConfig] = useState(notificationService.getSoundConfig());
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePresetChange = (preset: 'default' | 'gentle' | 'alert' | 'chime' | 'beep') => {
    notificationService.setNotificationSound(preset);
    setCurrentConfig(notificationService.getSoundConfig());
    
    // Testar o som
    notificationService.info('Som Atualizado', `Som alterado para: ${preset}`, { sound: true });
  };

  const handleCustomChange = (key: keyof typeof currentConfig, value: number | boolean) => {
    const newConfig = { ...currentConfig, [key]: value };
    notificationService.setSoundConfig(newConfig);
    setCurrentConfig(newConfig);
  };

  const testSound = () => {
    notificationService.info('Teste de Som', 'Testando configuração atual de som', { sound: true });
  };

  const playPreview = () => {
    if (isPlaying) {
      setIsPlaying(false);
      // Parar o som se estiver tocando
      notificationService.setSoundConfig({ ...currentConfig, loop: false });
    } else {
      setIsPlaying(true);
      // Tocar o som em loop para preview
      notificationService.setSoundConfig({ ...currentConfig, loop: true });
      notificationService.info('Preview de Som', 'Ouvindo configuração atual...', { sound: true });
      
      // Parar o loop após 3 segundos
      setTimeout(() => {
        setIsPlaying(false);
        notificationService.setSoundConfig({ ...currentConfig, loop: false });
      }, 3000);
    }
  };

  const presets = [
    { id: 'default', name: 'Padrão', desc: 'Volume médio, velocidade normal', icon: '🔔' },
    { id: 'gentle', name: 'Suave', desc: 'Volume baixo, velocidade lenta', icon: '🔕' },
    { id: 'alert', name: 'Alerta', desc: 'Volume alto, velocidade rápida', icon: '⚠️' },
    { id: 'chime', name: 'Sino', desc: 'Volume médio, com repetição', icon: '🎵' },
    { id: 'beep', name: 'Beep', desc: 'Volume alto, velocidade rápida', icon: '📢' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Music className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Personalizar Som</h3>
          <p className="text-sm text-gray-600">Configure o som das notificações usando o arquivo MP3 da Vitalis</p>
        </div>
      </div>

      {/* Arquivo de Som Atual */}
      <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Music className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h4 className="font-medium text-green-800">Arquivo de Som Atual</h4>
              <p className="text-sm text-green-600">new-notification-09-352705.mp3</p>
            </div>
          </div>
          <button
            onClick={playPreview}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              isPlaying
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="h-4 w-4 inline mr-2" />
                Parar Preview
              </>
            ) : (
              <>
                <Play className="h-4 w-4 inline mr-2" />
                Preview
              </>
            )}
          </button>
        </div>
      </div>

      {/* Presets de Som */}
      <div className="mb-6">
        <h4 className="text-md font-medium text-gray-700 mb-3">Sons Pré-configurados</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {presets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handlePresetChange(preset.id as any)}
              className={`p-3 rounded-lg border text-left transition-all hover:scale-105 ${
                currentConfig.volume === notificationService.getSoundConfig().volume &&
                currentConfig.playbackRate === notificationService.getSoundConfig().playbackRate
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{preset.icon}</span>
                <span className="font-medium text-gray-800">{preset.name}</span>
              </div>
              <p className="text-xs text-gray-600">{preset.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Configurações Personalizadas */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-md font-medium text-gray-700">Configurações Avançadas</h4>
          <button
            onClick={() => setIsCustomizing(!isCustomizing)}
            className="flex items-center gap-2 px-3 py-1 text-sm text-blue-600 hover:text-blue-700 transition-colors"
          >
            <Settings className="h-4 w-4" />
            {isCustomizing ? 'Ocultar' : 'Mostrar'}
          </button>
        </div>

        {isCustomizing && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            {/* Volume */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Volume: {Math.round(currentConfig.volume * 100)}%
              </label>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.1"
                value={currentConfig.volume}
                onChange={(e) => handleCustomChange('volume', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>10%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>

            {/* Velocidade de Reprodução */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Velocidade: {currentConfig.playbackRate}x
              </label>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={currentConfig.playbackRate}
                onChange={(e) => handleCustomChange('playbackRate', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0.5x</span>
                <span>1.0x</span>
                <span>2.0x</span>
              </div>
            </div>

            {/* Loop */}
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={currentConfig.loop}
                  onChange={(e) => handleCustomChange('loop', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Repetir som</span>
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Útil para notificações importantes que precisam de atenção
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Botão de Teste */}
      <div className="text-center">
        <button
          onClick={testSound}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg"
        >
          <Volume2 className="h-4 w-4" />
          Testar Som
        </button>
        <p className="text-xs text-gray-500 mt-2">
          Clique para testar o som com as configurações atuais
        </p>
      </div>

      {/* Status Atual */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="text-xs text-gray-600 mb-2">Configuração Atual:</div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="font-medium">Volume:</span> {Math.round(currentConfig.volume * 100)}%
          </div>
          <div>
            <span className="font-medium">Velocidade:</span> {currentConfig.playbackRate}x
          </div>
          <div>
            <span className="font-medium">Loop:</span> {currentConfig.loop ? 'Sim' : 'Não'}
          </div>
          <div>
            <span className="font-medium">Arquivo:</span> MP3
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoundCustomizer;
