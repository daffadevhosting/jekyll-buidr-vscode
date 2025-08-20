// webview-ui/src/post-editor.tsx

import * as React from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from './components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './components/ui/form';
import { Input } from './components/ui/input';
import { Textarea } from './components/ui/textarea';
import { Loader2, Sparkles, UploadCloud } from 'lucide-react';
import { useToast } from './hooks/use-toast'; // Pastikan path benar
// Hapus semua impor yang tidak perlu/berkaitan dengan server
// import Image from 'next/image'; // Ganti dengan <img>
// import { useAuth } from './hooks/use-auth'; // Gunakan data dari props
// ...

const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  author: z.string().optional(),
  categories: z.string().optional(),
  mainImage: z.string().optional(),
  content: z.string().min(10, 'Content must be at least 10 characters.'),
});

type PostFormValues = z.infer<typeof formSchema>;

// Props baru untuk PostEditor
interface PostEditorProps {
  onPublish: (values: PostFormValues) => void;
  onGenerateContent: (title: string) => void;
  onGenerateImage: (prompt: string) => void;
}

export function PostEditor({ onPublish, onGenerateContent, onGenerateImage }: PostEditorProps) {
  const { toast } = useToast(); // useToast masih bisa digunakan jika kamu menyalinnya
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isGenerating, setIsGenerating] = React.useState(false);

  const form = useForm<PostFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      author: 'Pro User', // Bisa diisi dari data yang dikirim ekstensi nanti
      categories: '',
      mainImage: '',
      content: '',
    },
  });

  const onSubmit = (values: PostFormValues) => {
    setIsSubmitting(true);
    toast({ title: 'Sending to extension...' });
    onPublish(values);
    // Logika setIsSubmitting(false) akan ditangani oleh ekstensi
  };

  const handleGenerate = () => {
    const title = form.getValues('title');
    if (!title) {
      toast({ variant: 'destructive', title: 'Title is required' });
      return;
    }
    setIsGenerating(true);
    onGenerateContent(title);
  };
  
  // ... (Komponen AiImageGenerateButton dan ImageUpload bisa dimasukkan di sini,
  //      atau di-refactor agar memanggil onGenerateImage)

  return (
    <div className="p-4 h-screen flex flex-col">
      <h2 className="text-lg font-semibold mb-1">Create New Post</h2>
      <p className="text-sm text-muted-foreground mb-4">Fill out the details below.</p>
      
      <div className="flex-1 overflow-y-auto pr-2">
        <Form {...form}>
          <form id="post-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* ... semua FormField (title, author, categories, content) ... */}
          </form>
        </Form>
      </div>

      <div className="pt-4 mt-4 border-t flex justify-between items-center">
        <Button size="sm" variant="outline" onClick={handleGenerate} disabled={isSubmitting || isGenerating}>
          <Sparkles className="mr-2 h-4 w-4" />
          Generate Content
        </Button>
        <Button type="submit" size="sm" form="post-form" disabled={isSubmitting || isGenerating}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Publish Post
        </Button>
      </div>
    </div>
  );
}