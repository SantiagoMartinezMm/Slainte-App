import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Checkbox } from '../ui/checkbox';
import { Progress } from '../ui/progress';
import { toast } from 'react-hot-toast';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (format: 'csv' | 'excel', options: ExportOptions) => Promise<void>;
  title: string;
  description: string;
  fields: { id: string; label: string }[];
}

export interface ExportOptions {
  format: 'csv' | 'excel';
  fields: string[];
  fileName?: string;
}

export default function ExportModal({
  isOpen,
  onClose,
  onExport,
  title,
  description,
  fields
}: ExportModalProps) {
  const [format, setFormat] = useState<'csv' | 'excel'>('csv');
  const [selectedFields, setSelectedFields] = useState<string[]>(fields.map(f => f.id));
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState('');

  // Manejar cambio en campos seleccionados
  const handleFieldChange = (field: string, checked: boolean) => {
    if (checked) {
      setSelectedFields([...selectedFields, field]);
    } else {
      setSelectedFields(selectedFields.filter(f => f !== field));
    }
  };

  // Manejar selección/deselección de todos los campos
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedFields(fields.map(f => f.id));
    } else {
      setSelectedFields([]);
    }
  };

  // Manejar exportación
  const handleExport = async () => {
    if (selectedFields.length === 0) {
      toast.error('Selecciona al menos un campo para exportar');
      return;
    }

    setIsExporting(true);
    setProgress(0);

    // Simular progreso
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
        }
        return newProgress > 100 ? 100 : newProgress;
      });
    }, 200);

    try {
      await onExport(format, {
        format,
        fields: selectedFields,
        fileName: fileName || undefined
      });
      
      // Asegurar que el progreso llegue al 100%
      setProgress(100);
      
      setTimeout(() => {
        toast.success('Exportación completada con éxito');
        onClose();
      }, 500);
    } catch (error) {
      console.error('Error al exportar:', error);
      toast.error('Error al exportar los datos');
    } finally {
      clearInterval(interval);
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Formato de exportación</Label>
            <RadioGroup
              value={format}
              onValueChange={(value) => setFormat(value as 'csv' | 'excel')}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="csv" id="csv" />
                <Label htmlFor="csv">CSV</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="excel" id="excel" />
                <Label htmlFor="excel">Excel</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Campos a exportar</Label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="select-all"
                  checked={selectedFields.length === fields.length}
                  onCheckedChange={handleSelectAll}
                />
                <Label htmlFor="select-all" className="text-sm">Seleccionar todos</Label>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {fields.map(field => (
                <div key={field.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={field.id}
                    checked={selectedFields.includes(field.id)}
                    onCheckedChange={(checked) => handleFieldChange(field.id, !!checked)}
                  />
                  <Label htmlFor={field.id} className="text-sm">{field.label}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="file-name">Nombre del archivo (opcional)</Label>
            <input
              id="file-name"
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder={`datos.${format}`}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          {isExporting && (
            <div className="space-y-2">
              <Label>Progreso</Label>
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-center">{progress}%</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isExporting}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleExport}
            disabled={isExporting || selectedFields.length === 0}
          >
            {isExporting ? 'Exportando...' : 'Exportar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
