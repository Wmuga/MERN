import { BrowserRouter, Link, Routes, Route } from 'react-router-dom';
import "./App.css"
import DropDown from './UI/DropDown/DropDown';
import Main from './pages/Main/Main';
import Profile from './pages/Profile/Profile';
import Login from './pages/Login/Login';
import Logout from './pages/Logout';
import {Auth, AuthContext, AuthContextProvider} from './utils/Auth';
import Vacancies from './pages/Vacancies/List/Vacancies';
import Resumes from './pages/Resumes/Resumes';
import VacancyEdit from './pages/Vacancies/Edit/VacancyEdit';
import Vacancy from './pages/Vacancies/Vacancy/Vacancy';

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
                        <Link className="header_href_deco" to="/profile/0">Профиль</Link>
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
            <Route path="/logout" element={<Logout/>} />
            <Route path="/vacancy" element={<Vacancies/>} />
            <Route path="/vacancy/:vacancyId" element={<Vacancy/>} />
            <Route path="/vacancy/:vacancyId/edit" element={<VacancyEdit/>} />
            <Route path="/resume" element={<Resumes/>} />
          </Routes>
          </main>
        </div>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
