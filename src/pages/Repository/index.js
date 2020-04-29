import React, { Component } from 'react';
import PropTypes from 'prop-types';
import api from '../../services/api';

import { Link } from 'react-router-dom';
import Container from '../../Components/Container';
import {
  Loading,
  Owner,
  IssueList,
  ButtonList,
  Button,
  NotHaveIssue,
} from './styles';

export default class Repository extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        repository: PropTypes.string,
      }),
    }).isRequired,
  };

  state = {
    repository: {},
    issues: [],
    loading: true,
    state: 'open',
    page: 1,
    lastPage: true,
  };

  async componentDidMount() {
    const repoName = this.getRepoName();
    const [repository, issues] = await Promise.all([
      api.get(`/repos/${repoName}`),
      api.get(`/repos/${repoName}/issues`),
      {
        params: {
          state: 'open',
          per_page: 5,
        },
      },
    ]);

    this.setState({
      repository: repository.data,
      issues: issues.data,
      loading: false,
    });
  }

  handleState = async (state) => {
    const repoName = this.getRepoName();
    const { page } = this.state;
    const issues = await this.getIssues(repoName, state, page);

    this.setState({
      issues: issues.data,
      state,
    });
  };

  handlePage = async (page) => {
    if (page === 0) {
      return this.setState({
        lastPage: true,
      });
    }

    const { state } = this.state;
    const repoName = this.getRepoName();

    const issues = await this.getIssues(repoName, state, page);

    this.setState({
      issues: issues.data,
      page,
      lastPage: false,
    });
  };

  getRepoName = () => {
    const { match } = this.props;
    return decodeURIComponent(match.params.repository);
  };

  getIssues = async (repoName, state, page) => {
    return await api.get(`/repos/${repoName}/issues`, {
      params: {
        state,
        per_page: 5,
        page,
      },
    });
  };

  render() {
    const { repository, issues, loading, page, lastPage } = this.state;

    if (loading) {
      return <Loading>Carregando...</Loading>;
    }

    return (
      <Container>
        <Owner>
          <Link to="/">Voltar aos repositórios</Link>
          <img src={repository.owner.avatar_url} alt={repository.owner.login} />
          <h1>{repository.name}</h1>
          <p>{repository.description}</p>
        </Owner>

        {issues.length !== 0 ? (
          <ButtonList>
            <Button onClick={() => this.handleState('all')}>Todas</Button>
            <Button onClick={() => this.handleState('open')}>Aberta</Button>
            <Button onClick={() => this.handleState('closed')}>Fechadas</Button>
          </ButtonList>
        ) : (
          ''
        )}

        <NotHaveIssue>
          {issues.length === 0 ? <p>Não possui issues.</p> : ''}
        </NotHaveIssue>

        {issues.length !== 0 ? (
          <>
            <IssueList>
              {issues.map((issue) => (
                <li key={String(issue.id)}>
                  <img src={issue.user.avatar_url} alt={issue.user.login} />
                  <div>
                    <strong>
                      <a href={issue.html_url}>{issue.title}</a>
                      {issue.labels.map((label) => (
                        <span key={String(label.id)}>{label.name}</span>
                      ))}
                    </strong>
                    <p>{issue.user.login}</p>
                  </div>
                </li>
              ))}
            </IssueList>

            <ButtonList>
              <Button
                lastPage={lastPage}
                onClick={() => this.handlePage(page - 1)}
              >
                Anterior
              </Button>
              <Button onClick={() => this.handlePage(page + 1)}>Próxima</Button>
            </ButtonList>
          </>
        ) : (
          ''
        )}
      </Container>
    );
  }
}
