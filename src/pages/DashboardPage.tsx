
import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { BookOpen, LogOut, PlusCircle, Clock, CheckCircle } from 'lucide-react';

interface BookSummary {
  id: string;
  title: string;
  type: string;
  category: string;
  timestamp: string;
  progress: number; // 0-100
}

const DashboardPage = () => {
  const { currentUser, logOut, loading } = useAuth();
  const navigate = useNavigate();
  const [books, setBooks] = useState<BookSummary[]>([]);
  
  useEffect(() => {
    // Load books from localStorage
    const loadBooks = () => {
      try {
        const storedBooks = JSON.parse(localStorage.getItem('bookKreateBooks') || '[]');
        
        // Calculate progress for each book
        const booksWithProgress = storedBooks.map((book: any) => {
          const planItems = JSON.parse(localStorage.getItem(`bookPlan_${book.id}`) || '[]');
          const totalItems = planItems.length || 1;
          const completedItems = planItems.filter((item: any) => item.status === 'completed').length;
          const progress = Math.round((completedItems / totalItems) * 100);
          
          return {
            id: book.id,
            title: book.title,
            type: book.type,
            category: book.category,
            timestamp: book.timestamp,
            progress
          };
        });
        
        setBooks(booksWithProgress);
      } catch (error) {
        console.error("Error loading books:", error);
      }
    };
    
    loadBooks();
  }, []);
  
  const handleCreateBook = () => {
    navigate('/book/create');
  };
  
  const handleViewBook = (bookId: string) => {
    navigate(`/book/plan/${bookId}`);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-book-purple"></div>
      </div>
    );
  }
  
  if (!currentUser && !loading) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-book-lightGray">
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-xl font-bold bg-gradient-to-r from-book-purple to-book-orange bg-clip-text text-transparent">
              Book-Kreate
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            {currentUser && currentUser.photoURL && (
              <img 
                src={currentUser.photoURL} 
                alt={currentUser.displayName || "User"} 
                className="w-10 h-10 rounded-full border-2 border-book-purple"
              />
            )}
            
            <Button 
              variant="outline" 
              size="sm"
              className="text-book-purple border-book-purple"
              onClick={logOut}
            >
              <LogOut size={16} className="mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-book-darkText">
            Welcome, {currentUser?.displayName || "User"}
          </h1>
          
          <Button 
            className="bg-book-purple hover:bg-book-purple/90"
            onClick={handleCreateBook}
          >
            <BookOpen size={16} className="mr-2" />
            Create New Book
          </Button>
        </div>
        
        {books.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h2 className="text-xl font-semibold mb-4 text-book-darkText">
              Your Book Dashboard
            </h2>
            <p className="text-slate-600 mb-6">
              You haven't created any books yet. Get started by clicking the "Create New Book" button.
            </p>
            
            <div className="max-w-md mx-auto">
              <Button 
                className="w-full py-6 bg-book-purple hover:bg-book-purple/90" 
                onClick={handleCreateBook}
              >
                <BookOpen size={18} className="mr-2" />
                Generate Book with AI
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Create New Book Card */}
            <div 
              className="bg-white rounded-lg shadow-md p-6 border-2 border-dashed border-book-purple/30 flex flex-col items-center justify-center text-center cursor-pointer hover:border-book-purple transition-colors"
              onClick={handleCreateBook}
            >
              <div className="w-16 h-16 rounded-full bg-book-purple/10 flex items-center justify-center mb-4">
                <PlusCircle size={32} className="text-book-purple" />
              </div>
              <h3 className="text-lg font-semibold text-book-darkText mb-2">
                Create New Book
              </h3>
              <p className="text-slate-500">
                Start generating your next masterpiece with AI
              </p>
            </div>
            
            {/* Book Cards */}
            {books.map((book) => (
              <div 
                key={book.id} 
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleViewBook(book.id)}
              >
                <div className="h-3 bg-gradient-to-r from-book-purple to-book-orange"></div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-book-darkText mb-1 line-clamp-1">
                    {book.title || "Untitled Book"}
                  </h3>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-book-purple/10 text-book-purple px-2 py-0.5 rounded-full text-xs">
                      {book.type}
                    </span>
                    <span className="bg-book-orange/10 text-book-orange px-2 py-0.5 rounded-full text-xs">
                      {book.category}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-500 flex items-center">
                      <Clock size={14} className="mr-1" />
                      {new Date(book.timestamp).toLocaleDateString()}
                    </span>
                    <span className="text-sm font-medium">
                      {book.progress === 100 ? (
                        <span className="text-green-600 flex items-center">
                          <CheckCircle size={14} className="mr-1" />
                          Complete
                        </span>
                      ) : (
                        <span className="text-book-purple">{book.progress}% Complete</span>
                      )}
                    </span>
                  </div>
                  
                  <div className="w-full bg-slate-200 rounded-full h-1.5">
                    <div 
                      className="bg-book-purple h-1.5 rounded-full" 
                      style={{ width: `${book.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;
