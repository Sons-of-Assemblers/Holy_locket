import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./patientprofile.css";

import img2 from './img2.png';
import img3 from './img3.png';
import img4 from './img4.png';
import img5 from './img5.png';
import img6 from './img6.png';
import img7 from './img7.png';
import img8 from './img8.png';
import img9 from './img9.png';

function Patientprofile() {
    const [InfoPage, setInfoPage] = useState([]);

    useEffect(() => {
        axios.get('https://localhost:7172/api/Patient/1')
            .then(response => {
                setInfoPage(response.data);
            })
            .catch(error => {
                console.error("Помилка при отриманні даних:", error);
            });
    }, []);

    return (
        <div className="body11">
            <img className="img11" src="https://ggclinic.com.ua/wp-content/uploads/2022/06/doctor-full.jpeg"/>
                <h2 className="h22">{InfoPage.firstName} {InfoPage.secondName}</h2>
                <img className="img22" src={img2}/>
                <img className="img33" src={img3}/>
                <div className='div11'>
                    <p className='p11'>Чоловік</p>
                    <img className="img44" src={img5}/>
                </div>
                <div className='div22'>
                    <p className='p11'>{InfoPage.birthday}</p>
                    <img className="img44" src={img4}/>
                </div>
                <div className='div22'>
                    <p className='p11'>{InfoPage.email}</p>
                    <img className="img44" src={img6}/>
                </div>
                <div className='div33'>
                    <p className='p11'>Україна, Київ</p>
                    <img className="img44" src={img7}/>
                </div>
                <div className='div44'>
                    <p className='p11'>{InfoPage.phone}</p>
                    <img className="img44" src={img8}/>
                </div>
                <div className='div44'>
                    <p className='p11'>1234567890</p>
                    <img className="img44" src={img9}/>
                </div>
            </div>
    );
}

export default Patientprofile;