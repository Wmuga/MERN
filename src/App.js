import { BrowserRouter, Link, Routes, Route } from 'react-router-dom';
import "./App.css"
import DropDown from './UI/DropDown/DropDown';
import Main from './pages/Main/Main';
import Profile from './pages/Profile/Profile';
import Login from './pages/Login/Login';
import Signin from './pages/Signin/Signin';
import Logout from './pages/Logout';
import {Auth, AuthContext, AuthContextProvider} from './utils/Auth';
import Vacancies from './pages/Vacancies/List/Vacancies';
import VacancyEdit from './pages/Vacancies/Edit/VacancyEdit';
import Vacancy from './pages/Vacancies/Vacancy/Vacancy';
import VacancyCreate from './pages/Vacancies/Create/VacancyCreate';
import Resumes from './pages/Resumes/List/Resumes';
import Resume from './pages/Resumes/Resume/Resume';
import ResumeCreate from './pages/Resumes/Create/ResumeCreate';
import ResumeEdit from './pages/Resumes/Edit/ResumeEdit';

function App() {
  return (
    <BrowserRouter>
      <Auth/>
      <AuthContextProvider>
        <div className="App">
          <header className="App-header">
            <div className="info">
              PLACEHOLDER
            </div>

            <nav>
              <Link className='header_href_deco' to="/vacancy">Вакансии</Link>
              <Link className='header_href_deco' to="/resume">Резюме</Link>
              <AuthContext.Consumer>
                {({user})=>{
                  if (user?.level===2) return (<Link className='header_href_deco' to="/resume">Пользователи</Link>)  
                }
                }
              </AuthContext.Consumer>

              <AuthContext.Consumer>
                {
                  ({user})=>{
                    return(user?.username?.length
                    ? <DropDown name={user?.username}>
                        <Link className="header_href_deco" to={`/profile/${user.userId}`}>Профиль</Link>
                        <Link className="header_href_deco" to="/logout">Выйти</Link>
                      </DropDown>
                    : <Link className='header_href_deco' to="/login">Войти</Link>
                          )}
                }
              </AuthContext.Consumer>
            </nav>
          </header>
          <main>
          <Routes>
            <Route index element={<Main/>}/>
            <Route path="/profile/:userId" element={<Profile/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/signin" element={<Signin/>} />
            <Route path="/logout" element={<Logout/>} />
            <Route path="/vacancy" element={<Vacancies/>} />
            <Route path="/vacancy/:vacancyId" element={<Vacancy/>} />
            <Route path="/vacancy/create" element={<VacancyCreate/>} />
            <Route path="/vacancy/:vacancyId/edit" element={<VacancyEdit/>} />
            <Route path="/resume" element={<Resumes/>} />
            <Route path="/resume/:resumeId" element={<Resume/>} />
            <Route path="/resume/create" element={<ResumeCreate/>} />
            <Route path="/resume/:resumeId/edit" element={<ResumeEdit/>} />
          </Routes>
          </main>
        </div>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
