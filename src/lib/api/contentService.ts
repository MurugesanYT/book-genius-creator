
import { toast } from "sonner";
import { generateWithGemini } from "./geminiService";
import { BookData, BookItemType } from "./types";
import { allBookTemplates } from "../bookTemplates";

// Function to generate book content based on type
export const generateBookContent = async (
  book: BookData, 
  itemType: BookItemType, 
  itemTitle: string,
  itemDescription?: string
): Promise<string> => {
  let prompt = "";
  
  // Check if a template is being used
  const templateId = book.template as string | undefined;
  const template = templateId ? allBookTemplates.find(t => t.id === templateId) : undefined;
  
  if (itemType === 'cover') {
    prompt = `Create a cover page for a ${book.type} book titled "${book.title}" in the ${book.category} category. This book is about: ${book.description}. Format the response as plain text with a simple structure. No markdown formatting.`;
    
    if (template?.coverSuggestion) {
      prompt += ` Consider the following design concept: ${template.coverSuggestion}.`;
    }
  } else if (itemType === 'chapter') {
    prompt = `Write a detailed chapter titled "${itemTitle}" for a ${book.type} book titled "${book.title}" in the ${book.category} category. 
    ${itemDescription ? `This chapter covers: ${itemDescription}.` : ''} 
    The book overall is about: ${book.description}.`;
    
    // If using a template, find the matching chapter structure and add it to the prompt
    if (template) {
      const chapterStructureItem = template.structure.find(item => item.title === itemTitle);
      if (chapterStructureItem) {
        prompt += ` According to the book structure, this chapter should focus on: ${chapterStructureItem.description}.`;
      }
    }
    
    prompt += ` Make it engaging, appropriate for the ${book.type} genre, and at least 500 words in length. Format the response as plain text with proper paragraphs. No markdown formatting.`;
  } else if (itemType === 'credits') {
    // Create a credits list prompt including the book's contributors
    const creditsList = book.credits && book.credits.length > 0
      ? book.credits
          .filter((credit: any) => credit.role && credit.name)
          .map((credit: any) => `${credit.role}: ${credit.name}`)
          .join("\n")
      : "Author: Anonymous";
    
    prompt = `Create a credits page for a ${book.type} book titled "${book.title}". Include the following contributors:\n${creditsList}\n\nFormat it as plain text with a simple structure. No markdown formatting.`;
  }
  
  console.log(`Generating content for ${itemType} "${itemTitle}" with prompt:`, prompt.substring(0, 150) + "...");
  
  try {
    // Increase max tokens for better content generation
    const content = await generateWithGemini(prompt, 4000);
    console.log(`Generated ${itemType} content successfully!`);
    toast.success(`${itemTitle} content generated successfully!`);
    return content;
  } catch (error) {
    console.error(`Error generating ${itemType} content:`, error);
    toast.error(`Failed to generate ${itemType} content. Please try again.`);
    
    // Try one more time with a simpler prompt
    try {
      let simplePrompt = "";
      if (itemType === 'cover') {
        simplePrompt = `Create a simple cover page for "${book.title}". Just include the title, genre, and a brief subtitle. Format as plain text, no markdown.`;
      } else if (itemType === 'chapter') {
        simplePrompt = `Write a brief chapter titled "${itemTitle}" for the book "${book.title}". Keep it simple but engaging, about 250 words. Format as plain text, no markdown.`;
      } else if (itemType === 'credits') {
        // Include actual credits in the fallback
        const creditsList = book.credits && book.credits.length > 0
          ? book.credits
              .filter((credit: any) => credit.role && credit.name)
              .map((credit: any) => `${credit.role}: ${credit.name}`)
              .join("\n")
          : "Author: Anonymous";
        
        simplePrompt = `Create a simple credits page for "${book.title}". Include:\n${creditsList}\nFormat as plain text, no markdown.`;
      }
      
      const backupContent = await generateWithGemini(simplePrompt, 2000);
      console.log(`Generated backup ${itemType} content successfully!`);
      toast.success(`${itemTitle} content generated with simplified format.`);
      return backupContent;
    } catch (backupError) {
      console.error(`Backup generation also failed:`, backupError);
      
      // Provide a very basic fallback content with actual book data
      if (itemType === 'cover') {
        return `${book.title}\n\nA ${book.type} book in the ${book.category} category\n\n${book.description}`;
      } else if (itemType === 'chapter') {
        return `${itemTitle}\n\nThis chapter was meant to cover: ${itemDescription || "various aspects of the book"}.\n\nPlease try regenerating this content.`;
      } else {
        // Ensure credits include actual data
        const creditsContent = book.credits && book.credits.length > 0
          ? book.credits
              .filter((credit: any) => credit.role && credit.name)
              .map((credit: any) => `${credit.role}: ${credit.name}`)
              .join("\n")
          : "Author: Anonymous";
          
        return `Credits\n\n${creditsContent}`;
      }
    }
  }
};
