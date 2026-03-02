import { defineStore } from 'pinia'

export const useBookStore = defineStore('book', {
  state: () => ({
    books: [
      {
        id: 1,
        title: 'Vue.js实战',
        author: '梁灏',
        isbn: '9787115421878',
        category: '前端开发',
        stock: 10,
        borrowed: 2
      },
      {
        id: 2,
        title: 'JavaScript高级程序设计',
        author: 'Nicholas C. Zakas',
        isbn: '9787115275790',
        category: '前端开发',
        stock: 15,
        borrowed: 3
      },
      {
        id: 3,
        title: 'Python编程：从入门到实践',
        author: 'Eric Matthes',
        isbn: '9787115428028',
        category: '后端开发',
        stock: 8,
        borrowed: 1
      }
    ]
  }),
  getters: {
    availableBooks: (state) => state.books.filter(book => book.stock > 0),
    totalBooks: (state) => state.books.length
  },
  actions: {
    addBook(book) {
      const newId = Math.max(...this.books.map(b => b.id), 0) + 1
      this.books.push({ ...book, id: newId, borrowed: 0 })
    },
    updateBook(updatedBook) {
      const index = this.books.findIndex(book => book.id === updatedBook.id)
      if (index !== -1) {
        this.books[index] = { ...this.books[index], ...updatedBook }
      }
    },
    deleteBook(id) {
      this.books = this.books.filter(book => book.id !== id)
    },
    borrowBook(id) {
      const book = this.books.find(book => book.id === id)
      if (book && book.stock > 0) {
        book.stock--
        book.borrowed++
      }
    },
    returnBook(id) {
      const book = this.books.find(book => book.id === id)
      if (book && book.borrowed > 0) {
        book.stock++
        book.borrowed--
      }
    }
  }
})

export const useStudentStore = defineStore('student', {
  state: () => ({
    students: [
      {
        id: 1,
        name: '张三',
        studentId: '2021001',
        major: '计算机科学与技术',
        grade: '大三',
        borrowedBooks: 2
      },
      {
        id: 2,
        name: '李四',
        studentId: '2021002',
        major: '软件工程',
        grade: '大二',
        borrowedBooks: 1
      },
      {
        id: 3,
        name: '王五',
        studentId: '2021003',
        major: '数据科学',
        grade: '大一',
        borrowedBooks: 0
      }
    ]
  }),
  getters: {
    totalStudents: (state) => state.students.length
  },
  actions: {
    addStudent(student) {
      const newId = Math.max(...this.students.map(s => s.id), 0) + 1
      this.students.push({ ...student, id: newId, borrowedBooks: 0 })
    },
    updateStudent(updatedStudent) {
      const index = this.students.findIndex(student => student.id === updatedStudent.id)
      if (index !== -1) {
        this.students[index] = { ...this.students[index], ...updatedStudent }
      }
    },
    deleteStudent(id) {
      this.students = this.students.filter(student => student.id !== id)
    },
    incrementBorrowedBooks(studentId) {
      const student = this.students.find(s => s.studentId === studentId)
      if (student) {
        student.borrowedBooks++
      }
    },
    decrementBorrowedBooks(studentId) {
      const student = this.students.find(s => s.studentId === studentId)
      if (student && student.borrowedBooks > 0) {
        student.borrowedBooks--
      }
    }
  }
})

export const useBorrowStore = defineStore('borrow', {
  state: () => ({
    borrows: [
      {
        id: 1,
        bookId: 1,
        studentId: '2021001',
        borrowDate: '2026-02-15',
        returnDate: null,
        status: 'borrowed'
      },
      {
        id: 2,
        bookId: 2,
        studentId: '2021001',
        borrowDate: '2026-02-16',
        returnDate: null,
        status: 'borrowed'
      },
      {
        id: 3,
        bookId: 3,
        studentId: '2021002',
        borrowDate: '2026-02-17',
        returnDate: null,
        status: 'borrowed'
      }
    ]
  }),
  getters: {
    activeBorrows: (state) => state.borrows.filter(borrow => borrow.status === 'borrowed'),
    returnedBorrows: (state) => state.borrows.filter(borrow => borrow.status === 'returned')
  },
  actions: {
    addBorrow(borrow) {
      const newId = Math.max(...this.borrows.map(b => b.id), 0) + 1
      this.borrows.push({ ...borrow, id: newId, status: 'borrowed' })
    },
    returnBook(id) {
      const borrow = this.borrows.find(b => b.id === id)
      if (borrow) {
        borrow.returnDate = new Date().toISOString().split('T')[0]
        borrow.status = 'returned'
      }
    }
  }
})