import cReact, { useEffect, useState } from 'react';
import "./appointment.css";
import { useLocation } from 'react-router-dom';
import axios from "axios";
import Modal_Appointment from "../../component/modal-appointment";

const Appointment = () => {
    const currentDay = new Date();
    const [time_slots, setTime_slots] = useState([]);
    const indexDayOfWeek = currentDay.getDay();
    const daysOfWeek = ["НЕДІЛЯ", 'ПОНЕДІЛОК', 'ВІВТОРОК', 'СЕРЕДА', 'ЧЕТВЕР', "П'ЯТНИЦЯ", "CУБОТА"];
    const firstPartOfWeek = daysOfWeek.slice(indexDayOfWeek);
    const secondPartOfWeek = daysOfWeek.slice(0, indexDayOfWeek);
    const WorkWeek = [...firstPartOfWeek, ...secondPartOfWeek];

    const dateObj = new Date();
    const currentDate = dateObj.getDate();
    const dateArray = [];

    for (let i = 0; i < 7; i++) {
        const newDate = new Date();
        newDate.setDate(currentDate + i);
        dateArray.push(newDate);
    }

    const location = useLocation();
    const { doctor } = location.state;
    const [modalActive, setModalActive] = useState(false);
    const [selectedTime, setSelectedTime] = useState('');
    const [selectedDay, setSelectedDay] = useState('');

    useEffect(() => {
        axios.get('https://localhost:7172/api/Appointment/TimeSlots')
            .then(response => {
                setTime_slots(response.data);
                console.log("Peremoga")
            })
            .catch(error => {
                console.error("Ошибка при получении данных о врачах:", error);
            });

    }, []);

    const [visibleRows, setVisibleRows] = useState(4);
    const [showAllSlots, setShowAllSlots] = useState(false);

    const renderTimeSlots = () => {
        return (
            <>
                <thead>
                    <tr>
                        {WorkWeek.map((day, dayIndex) => (
                            <th key={dayIndex}>
                                {day}
                                <br />
                                {dateArray[dayIndex] && dateArray[dayIndex].toLocaleDateString('uk-UA')}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {time_slots.length > 0 && (
                        // Используем map для прохода по всем временным слотам в виде строки
                        Array.from({ length: Math.max(...time_slots.map(slots => slots.length)) }).map((_, timeIndex) => (
                            <tr key={timeIndex} style={{ display: showAllSlots || timeIndex < visibleRows ? 'table-row' : 'none' }}>
                                {/* Для каждой колонки показываем таймслот, если он есть */}
                                {time_slots.map((slots, dayIndex) => (
                                    <td key={dayIndex}>
                                        {slots[timeIndex] && (
                                            <button
                                                className="time-btn"
                                                onClick={() => handleTimeSelection(slots[timeIndex], WorkWeek[dayIndex], dateArray[dayIndex])}
                                            >
                                                {slots[timeIndex]}
                                            </button>
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={WorkWeek.length}>
                            <button
                                className="btn_show_more"
                                onClick={() => setShowAllSlots(!showAllSlots)}
                                style={{ display: visibleRows === 12 ? 'none' : 'block' }}
                            >
                                {showAllSlots ? 'Show less' : 'Show more'}
                            </button>
                        </td>
                    </tr>
                </tfoot>
            </>
        );
    };

    const handleTimeSelection = (time, day, date) => {
        setSelectedTime(time);
        setSelectedDay(`${date.getDate().toString().padStart(2, '0')}.${date.getMonth() + 1}.${date.getFullYear()}`);
        setModalActive(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post('https://localhost:7172/api/Appointment', {
            time: selectedTime,
            date: selectedDay,
            hospitalId: 1,
            doctorId: doctor.id,
            patientId: 1,
        })

            .then((response) => {
                console.log("Peremoga");
            })
            .catch((error) => {
                console.error('Ошибка при отправке данных:', error);
            });
    }

    return (
        <div className="appoint">
            <div className="doctors">
                <div className="doctor-photo">
                    <img className="appoint-photo" src="https://ggclinic.com.ua/wp-content/uploads/2022/06/doctor-full.jpeg"
                         alt={`${doctor.firstName} ${doctor.secondName}`}
                    />
                </div>
                <div className="doctor-info">
                    <h2 className="special">
                        {doctor.firstName} {doctor.secondName}
                        <p>{doctor.specialityName || "Специальность не найдена"}</p>
                    </h2>
                    <h3>Про лікаря:</h3>
                    <p>Стать: {doctor.gender}</p>
                    <p>Стаж: {doctor.experience}</p>
                    <p>{doctor.description} </p>
                </div>
            </div>
            <table>
                <p className="head">Записатись на прийом:</p>
                {renderTimeSlots()}
            </table>

            {modalActive && (
                <Modal_Appointment
                    active={modalActive}
                    setActive={() => setModalActive(false)}
                    time={selectedTime}
                    day={selectedDay}
                >
                    <h3>
                        <p>
                            Ви впевненні, що хочете записатися до лікаря <span>{doctor.firstName} {doctor.secondName} </span>
                            на {selectedDay} о {selectedTime}?
                        </p>
                        <div>
                            <form action="#" method="POST" onSubmit={handleSubmit}>
                                <button className="confirm" type="submit">
                                    Підтвердити
                                </button>
                            </form>
                        </div>
                    </h3>
                </Modal_Appointment>
            )}
        </div>
    );
};

export default Appointment;
