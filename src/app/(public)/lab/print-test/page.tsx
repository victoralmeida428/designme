'use client'

import { useEffect, useRef, useState, useCallback } from 'react';
import { Canvas, Rect, IText, FabricObject, TDataUrlOptions } from 'fabric';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// SHADCN IMPORTS
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Loader2, Wand2, Palette, Type, RotateCcw } from "lucide-react"; // Importei RotateCcw

// --- 1. CONFIGURAÇÃO (CONSTANTES) ---
const DEFAULT_VALUES = {
    text: "Nanda & Victor",
    fill: "#D4AF37",
    isFoil: true
};

const objectPropertiesSchema = z.object({
  text: z.string().optional(),
  fill: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, "Cor Hex inválida"),
  isFoil: z.boolean(),
});

type ObjectProperties = z.infer<typeof objectPropertiesSchema>;

interface CustomFabricObject extends FabricObject {
    isFoil?: boolean;
    originalColor?: FabricObject['fill'];
    text?: string;
}

export default function PrintTestPage() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [fabricCanvas, setFabricCanvas] = useState<Canvas | null>(null);
    
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [basePrintUrl, setBasePrintUrl] = useState<string>('');
    const [foilMaskUrl, setFoilMaskUrl] = useState<string>('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [hasSelection, setHasSelection] = useState(false);

    const form = useForm<ObjectProperties>({
        resolver: zodResolver(objectPropertiesSchema),
        defaultValues: DEFAULT_VALUES,
        mode: "onChange",
    });

    // --- 2. FUNÇÃO REUTILIZÁVEL: CARREGAR TEMPLATE ---
    // Usamos useCallback para não recriar a função a cada render
    const loadTemplate = useCallback((canvas: Canvas) => {
        // 1. Limpa tudo (remove objetos antigos)
        canvas.clear();
        canvas.backgroundColor = '#ffe4e1';

        // 2. Recria Fundo
        const bgRect = new Rect({
            left: 20, top: 20, width: 460, height: 660,
            fill: '#ffe4e1',
            selectable: false, evented: false,
        }) as CustomFabricObject;
        canvas.add(bgRect);

        // 3. Recria Texto Estático
        const textBase = new IText('Convite de Casamento', {
            left: 50, top: 100, fontFamily: 'Helvetica', fontSize: 24, fill: '#555555',
        }) as CustomFabricObject;
        textBase.isFoil = false;
        canvas.add(textBase);

        // 4. Recria Texto Editável (Foil)
        const textFoil = new IText(DEFAULT_VALUES.text, {
            left: 50, top: 300, 
            fontFamily: 'Times New Roman', 
            fontSize: 60, 
            fill: DEFAULT_VALUES.fill, 
            fontWeight: 'bold'
        }) as CustomFabricObject;
        textFoil.isFoil = DEFAULT_VALUES.isFoil;
        canvas.add(textFoil);

        // Atualiza renderização
        canvas.requestRenderAll();
        
        // Remove seleção antiga da UI
        setHasSelection(false);
    }, []);

    // --- 3. INICIALIZAÇÃO ---
    useEffect(() => {
        if (!canvasRef.current) return;

        const canvas = new Canvas(canvasRef.current, {
            width: 500, height: 700, backgroundColor: '#f3f3f3',
        });

        // Carrega o template inicial
        loadTemplate(canvas);

        // Listeners
        const updateFormFromCanvas = () => {
            const activeObj = canvas.getActiveObject() as CustomFabricObject;
            if (activeObj && activeObj.type === 'i-text') {
                setHasSelection(true);
                form.reset({
                    text: activeObj.text || "",
                    fill: (activeObj.fill as string) || "#000000",
                    isFoil: !!activeObj.isFoil
                });
            } else {
                setHasSelection(false);
            }
        };

        canvas.on('selection:created', updateFormFromCanvas);
        canvas.on('selection:updated', updateFormFromCanvas);
        canvas.on('selection:cleared', () => setHasSelection(false));

        setFabricCanvas(canvas);

        return () => { canvas.dispose(); }
    }, [form, loadTemplate]);

    // --- 4. HANDLER DE RESET ---
    const handleReset = () => {
        if (!fabricCanvas) return;
        
        // 1. Reseta o Canvas Visualmente
        loadTemplate(fabricCanvas);
        
        // 2. Reseta o Formulário para os valores padrão
        form.reset(DEFAULT_VALUES);

        // 3. Limpa os previews gerados anteriormente (opcional)
        setPreviewUrl('');
        setBasePrintUrl('');
        setFoilMaskUrl('');
    };

    // ... (applyChangesToCanvas e handleGenerateFiles permanecem iguais)
    const applyChangesToCanvas = (values: ObjectProperties) => {
        if (!fabricCanvas) return;
        const activeObj = fabricCanvas.getActiveObject() as CustomFabricObject;
        if (!activeObj) return;

        if (values.text !== undefined && activeObj.type === 'i-text') {
            (activeObj as IText).set('text', values.text);
        }

        if (values.isFoil !== activeObj.isFoil) {
            activeObj.set('isFoil', values.isFoil);
            if (values.isFoil) {
                activeObj.set('fill', '#D4AF37'); 
                form.setValue('fill', '#D4AF37'); 
            } else {
                activeObj.set('fill', values.fill); 
            }
        } else if (values.fill !== activeObj.fill) {
            activeObj.set('fill', values.fill);
            if (activeObj.isFoil) {
                activeObj.set('isFoil', false);
                form.setValue('isFoil', false);
            }
        }
        fabricCanvas.requestRenderAll();
    };

    const handleGenerateFiles = () => {
        if (!fabricCanvas) return;
        setIsProcessing(true);
        setTimeout(() => {
            try {
                fabricCanvas.discardActiveObject();
                fabricCanvas.requestRenderAll();
                const HD_SCALE = 4;
                const exportOptions: TDataUrlOptions = { format: 'png', multiplier: 1 };

                setPreviewUrl(fabricCanvas.toDataURL(exportOptions));

                fabricCanvas.getObjects().forEach((obj) => {
                    const item = obj as CustomFabricObject;
                    if (item.isFoil) item.visible = false;
                });
                fabricCanvas.renderAll();
                setBasePrintUrl(fabricCanvas.toDataURL({ ...exportOptions, multiplier: HD_SCALE }));

                const originalBg = fabricCanvas.backgroundColor;
                fabricCanvas.backgroundColor = '#ffffff';
                fabricCanvas.getObjects().forEach((obj) => {
                    const item = obj as CustomFabricObject;
                    if (item.isFoil) {
                        item.visible = true;
                        item.originalColor = item.fill;
                        item.set('fill', '#000000');
                    } else {
                        item.visible = false;
                    }
                });
                fabricCanvas.renderAll();
                setFoilMaskUrl(fabricCanvas.toDataURL({ ...exportOptions, multiplier: HD_SCALE }));

                fabricCanvas.backgroundColor = originalBg;
                fabricCanvas.getObjects().forEach((obj) => {
                    const item = obj as CustomFabricObject;
                    item.visible = true;
                    if (item.isFoil && item.originalColor !== undefined) {
                        item.set('fill', item.originalColor);
                    }
                });
                fabricCanvas.renderAll();
            } catch (error) {
                console.error("Erro:", error);
            } finally {
                setIsProcessing(false);
            }
        }, 100);
    };

    return (
        <div className="min-h-screen bg-slate-50 p-8 font-sans">
            <header className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Editor Web-to-Print</h1>
                    <p className="text-slate-500 mt-2">Fabric.js v6 + Shadcn UI + Zod</p>
                </div>
                {/* BOTÃO DE RESET NA HEADER */}
                <Button 
                    variant="outline" 
                    onClick={handleReset}
                    className="text-slate-600 border-slate-300 hover:bg-slate-100"
                >
                    <RotateCcw className="w-4 h-4 mr-2"/> Restaurar Template
                </Button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-4 flex flex-col gap-6">
                    <Card className={!hasSelection ? "opacity-60 pointer-events-none grayscale" : ""}>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium uppercase tracking-wider flex items-center gap-2">
                                <Wand2 className="w-4 h-4" /> 
                                {hasSelection ? "Editar Objeto" : "Selecione um Texto"}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="text"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2"><Type className="w-4 h-4"/> Conteúdo</FormLabel>
                                                <FormControl>
                                                    <Input {...field} onChange={(e) => { field.onChange(e); applyChangesToCanvas({ ...form.getValues(), text: e.target.value }); }} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="fill"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="flex items-center gap-2"><Palette className="w-4 h-4"/> Cor</FormLabel>
                                                    <FormControl>
                                                        <div className="flex gap-2">
                                                            <div className="w-10 h-10 rounded border shadow-sm shrink-0" style={{ backgroundColor: field.value }} />
                                                            <Input type="color" {...field} className="h-10 w-full cursor-pointer p-1" onChange={(e) => { field.onChange(e); applyChangesToCanvas({ ...form.getValues(), fill: e.target.value }); }} />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="isFoil"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-col gap-2">
                                                    <FormLabel className="flex items-center gap-2">Acabamento Foil</FormLabel>
                                                    <FormControl>
                                                        <div className="flex items-center space-x-2 h-10">
                                                            <Switch checked={field.value} onCheckedChange={(checked) => { field.onChange(checked); applyChangesToCanvas({ ...form.getValues(), isFoil: checked }); }} />
                                                            <span className="text-xs text-muted-foreground">{field.value ? "Ativado ✨" : "Desativado"}</span>
                                                        </div>
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>

                    <div className="bg-white p-2 shadow-sm rounded-xl border relative overflow-hidden">
                        <canvas ref={canvasRef} />
                    </div>

                    <Button size="lg" onClick={handleGenerateFiles} disabled={isProcessing} className="w-full font-bold shadow-lg">
                        {isProcessing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processando...</> : "Finalizar e Gerar Arquivos"}
                    </Button>
                </div>

                <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-blue-600">Base de Impressão (CMYK)</CardTitle>
                            <CardDescription>Arquivo PNG sem elementos metalizados.</CardDescription>
                        </CardHeader>
                        <CardContent className="bg-slate-100 min-h-[300px] flex items-center justify-center p-4">
                            {basePrintUrl ? <img src={basePrintUrl} className="max-w-full shadow-md border" /> : <span className="text-slate-400 italic">Aguardando geração...</span>}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-black">Máscara de Foil (K:100)</CardTitle>
                            <CardDescription>Fundo branco e elementos em preto sólido.</CardDescription>
                        </CardHeader>
                        <CardContent className="bg-slate-100 min-h-[300px] flex items-center justify-center p-4">
                            {foilMaskUrl ? <img src={foilMaskUrl} className="max-w-full shadow-md border" /> : <span className="text-slate-400 italic">Aguardando geração...</span>}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}