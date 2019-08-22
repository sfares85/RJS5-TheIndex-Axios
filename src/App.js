import React, { Component } from "react";
import axios from "axios";

// Components
import Sidebar from "./Sidebar";
import AuthorsList from "./AuthorsList";
import AuthorDetail from "./AuthorDetail";
import Loading from "./Loading";

class App extends Component {
  state = {
    currentAuthor: null,
    filteredAuthors: [],
    authors: [],
    loading: true
  };

  handleFetch = async () => {
    try {
      let response = await axios.get(
        "https://the-index-api.herokuapp.com/api/authors/"
      );
      this.setState({ authors: response.data });
    } catch (error) {
      console.log(error);
    }
  };

  selectAuthor = async author => {
    this.setState({ loading: true });
    let response = await axios.get(
      `https://the-index-api.herokuapp.com/api/authors/${author.id}/`
    );
    this.setState({ currentAuthor: response.data });
    this.setState({ loading: false });
  };
  unselectAuthor = () => this.setState({ currentAuthor: null });

  filterAuthors = query => {
    query = query.toLowerCase();
    let filteredAuthors = this.state.authors.filter(author => {
      return `${author.first_name} ${author.last_name}`
        .toLowerCase()
        .includes(query);
    });
    this.setState({ filteredAuthors: filteredAuthors });
  };

  getContentView = () => {
    if (this.state.loading) {
      return <Loading />;
    }
    if (this.state.currentAuthor) {
      return <AuthorDetail author={this.state.currentAuthor} />;
    } else {
      return (
        <AuthorsList
          authors={this.state.filteredAuthors}
          selectAuthor={this.selectAuthor}
          filterAuthors={this.filterAuthors}
        />
      );
    }
  };
  async componentDidMount() {
    let response = await axios.get(
      "https://the-index-api.herokuapp.com/api/authors/"
    );
    let authors = response.data;
    this.setState({ authors: authors });
    this.setState({ filteredAuthors: authors });
    this.setState({ loading: false });
  }
  render() {
    this.handleFetch();
    return (
      <div id="app" className="container-fluid">
        <div className="row">
          <div className="col-2">
            <Sidebar unselectAuthor={this.unselectAuthor} />
          </div>
          <div className="content col-10">{this.getContentView()}</div>
        </div>
      </div>
    );
  }
}

export default App;
