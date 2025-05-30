import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader } from '../../components/Loader/Loader';
import { getPeople } from '../../api';
import { Person } from '../../types/Person';

export const PeoplePage = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const { slug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    setError(false);

    getPeople()
      .then(setPeople)
      .catch(() => setError(true))
      .finally(() => setIsLoading(false));
  }, []);

  const findPersonBySlug = (name: string | null) => {
    if (!name) {
      return null;
    }

    return people.find(person => person.name === name);
  };

  const handlePersonClick = (personSlug: string) => {
    navigate(`/people/${personSlug}`, { replace: true });
  };

  return (
    <>
      <h1 className="title">People Page</h1>

      <div className="block">
        <div className="box table-container">
          {isLoading && <Loader />}

          {error && (
            <p data-cy="peopleLoadingError" className="has-text-danger">
              Something went wrong
            </p>
          )}

          {!isLoading && !error && people.length === 0 && (
            <p data-cy="noPeopleMessage">There are no people on the server</p>
          )}

          {!isLoading && !error && people.length > 0 && (
            <table
              data-cy="peopleTable"
              className="table is-striped is-hoverable is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Sex</th>
                  <th>Born</th>
                  <th>Died</th>
                  <th>Mother</th>
                  <th>Father</th>
                </tr>
              </thead>

              <tbody>
                {people.map(person => {
                  const mother = findPersonBySlug(person.motherName);
                  const father = findPersonBySlug(person.fatherName);

                  return (
                    <tr
                      key={person.slug}
                      data-cy="person"
                      className={
                        person.slug === slug ? 'has-background-warning' : ''
                      }
                    >
                      <td>
                        <a
                          className={
                            person.sex === 'f' ? 'has-text-danger' : ''
                          }
                          href={`#/people/${person.slug}`}
                          onClick={e => {
                            e.preventDefault();
                            handlePersonClick(person.slug);
                          }}
                        >
                          {person.name}
                        </a>
                      </td>
                      <td>{person.sex}</td>
                      <td>{person.born}</td>
                      <td>{person.died}</td>
                      <td>
                        {person.motherName ? (
                          mother ? (
                            <a
                              className={
                                mother.sex === 'f' ? 'has-text-danger' : ''
                              }
                              href={`#/people/${mother.slug}`}
                              onClick={e => {
                                e.preventDefault();
                                handlePersonClick(mother.slug);
                              }}
                            >
                              {person.motherName}
                            </a>
                          ) : (
                            person.motherName
                          )
                        ) : (
                          '-'
                        )}
                      </td>
                      <td>
                        {person.fatherName ? (
                          father ? (
                            <a
                              className={
                                father.sex === 'f' ? 'has-text-danger' : ''
                              }
                              href={`#/people/${father.slug}`}
                              onClick={e => {
                                e.preventDefault();
                                handlePersonClick(father.slug);
                              }}
                            >
                              {person.fatherName}
                            </a>
                          ) : (
                            person.fatherName
                          )
                        ) : (
                          '-'
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};
