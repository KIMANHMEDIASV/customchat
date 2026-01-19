'use client';

import { useState, useEffect } from 'react';
import { aiModelsAPI } from '@/lib/api';
import { AIModel } from '@/types';

interface ModelSelectorProps {
  selectedModelId?: string;
  onSelectModel: (modelId: string) => void;
}

export default function ModelSelector({
  selectedModelId,
  onSelectModel,
}: ModelSelectorProps) {
  const [models, setModels] = useState<AIModel[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      setLoading(true);
      try {
        const response = await aiModelsAPI.getActive();
        setModels(response.data);
      } catch (error) {
        console.error('Failed to load models:', error);
      } finally {
        setLoading(false);
      }
    };

    loadModels();
  }, []);

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 p-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        AI Model
      </label>
      <select
        value={selectedModelId || ''}
        onChange={(e) => onSelectModel(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
        disabled={loading}
      >
        <option value="">Select a model</option>
        {models.map((model) => (
          <option key={model.id} value={model.id}>
            {model.nameDisplay}
          </option>
        ))}
      </select>
    </div>
  );
}
