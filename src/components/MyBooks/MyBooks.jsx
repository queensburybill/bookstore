import React, { Component } from "react";
import axios from 'axios';
import BookList from "../BookList/BookList";
import "./MyBooks.css";

class MyBooks extends Component {
  state = {
    books: {},
    isLoading: false,
    isError: false,
    errorMessage: ""
  };

  getMyBooks = () => {
    this.setState({ isLoading: true });
    return axios
      .get('http://localhost:7000/bookshelf')
      .then(response => {
        if (!response.data) {
          throw new Error("Invalid response from server.");
        } else {
          this.setState({
            books: response.data.books,
            isLoading: false
          });
        }
      })
      .catch((error)=> {
        this.setState({
          isLoading: false,
          isError: true,
          errorMessage: error.message
        });
          console.log(error.message);
      });
  }

  componentDidMount() {
    this.getMyBooks();
  }

  render() {
    const categoryClasses = ["future-reads", "currently-reading", "already-read"];
    const books = this.state.books;

    return (
      <div className="my-books">
        <section><p>MY BOOKS</p></section>

        {this.state.isLoading
        ? <div className="error">
            <p>Loading...</p>
          </div>  
        : ( 
          this.state.isError
          ? <div className="error">
              <p>{this.state.errorMessage}</p>
            </div> 
          : Object.keys(books).map((category, index) => {
            const categoryClass = categoryClasses[index];
            const categoryName = categoryClass.replace('-', ' ').replace(/(^\w)|(\b\w)/g, char => char.toUpperCase());
            return (
              <div className={categoryClass} key={categoryClass}>
                <h2>{categoryName}</h2>
                <BookList 
                  listType="my-books"
                  books={this.state.books[category]}
                  getMyBooks={this.getMyBooks}
                />
              </div>
            );
          })
        )
      }
      </div>
    )
  }
}

export default MyBooks;