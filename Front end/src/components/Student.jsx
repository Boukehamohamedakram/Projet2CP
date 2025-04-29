import React, { useState } from 'react';
import NavBar from './NavBar';
import Footer from './Footer';
import './Student.css';

// Assets (put these in src/assets/)
import searchIcon    from '../assets/search-icon.png';
import studentAvatar from '../assets/Avatar.png';


export default function Student() {
  // student list
  const [students] = useState([
    { id: 1,  name: 'Manseur Hicham',   class: 'B 06', studentId: '23/0141' },
    { id: 2,  name: 'Amina Belkacem',   class: 'C 03', studentId: '23/0142' },
    { id: 3,  name: 'Youssef Zaid',      class: 'A 01', studentId: '23/0143' },
    { id: 4,  name: 'Leila Merabet',     class: 'B 02', studentId: '23/0144' },
    { id: 5,  name: 'Rachid Bouzid',     class: 'C 05', studentId: '23/0145' },
    { id: 6,  name: 'Nadia Cherif',      class: 'A 04', studentId: '23/0146' },
    { id: 7,  name: 'Sofiane Benali',    class: 'B 01', studentId: '23/0147' },
    { id: 8,  name: 'Karima Saïd',       class: 'C 02', studentId: '23/0148' },
    { id: 9,  name: 'Lotfi Haddad',      class: 'A 03', studentId: '23/0149' },
    { id: 10, name: 'Djamila Khelladi',  class: 'B 04', studentId: '23/0150' },
    { id: 11, name: 'Walid Derdouri',    class: 'C 01', studentId: '23/0151' },
    { id: 12, name: 'Houda Bensaïd',     class: 'A 02', studentId: '23/0152' },
    { id: 13, name: 'Farid Amrani',      class: 'B 03', studentId: '23/0153' },
    { id: 14, name: 'Samia Belmokhtar',  class: 'C 04', studentId: '23/0154' },
    { id: 15, name: 'Riyad Zerguini',    class: 'A 05', studentId: '23/0155' },
  ]);
  

  return (
    <>
      <NavBar />

      <main className="student-main">
        {/* Header */}
        <section className="student-header">
          <h1 className="student-title">
            Add New Student <span className="student-add">＋</span>
          </h1>

          <div className="student-filter-search">
            <img src={searchIcon} alt="Search" className="ss-icon" />

            <button className="ss-filter">
              Filter <span className="ss-arrow">▾</span>
            </button>

            <input
              type="text"
              placeholder="Search"
              className="ss-input"
            />
          </div>
        </section>

        {/* Student List */}
        <div className="student-list">
          {students.map(s => (
            <div key={s.id} className="student-row">
              <div className="student-card">
                <img
                  src={studentAvatar}
                  alt={s.name}
                  className="student-avatar"
                />
                <span className="student-name">{s.name}</span>
                <span className="student-class">{s.class}</span>
                <span className="student-id">{s.studentId}</span>
                <button className="student-manage">Manage</button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </>
  );
}
