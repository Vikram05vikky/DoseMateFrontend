// export interface Doctor {
//   id: string;
//   name: string;
//   email: string;
//   phone: string;
//   specialization: string;
//   licenseNumber: string;
//   registrationDate: string;
//   status: 'pending' | 'approved' | 'rejected';
//   password?: string;
// }/**
//  * Doctor object
//  * @typedef {Object} Doctor
//  * @property {string} id
//  * @property {string} name
//  * @property {string} email
//  * @property {string} phone
//  * @property {string} specialization
//  * @property {string} licenseNumber
//  * @property {string} registrationDate
//  * @property {'pending'|'approved'|'rejected'} status
//  * @property {string} [password]
//  */

// /**
//  * Patient object
//  * @typedef {Object} Patient
//  * @property {string} id
//  * @property {string} name
//  * @property {number} age
//  * @property {'male'|'female'|'other'} gender
//  * @property {string} mobile
//  * @property {string} email
//  * @property {string} address
//  * @property {string} doctorId
//  * @property {string} registrationDate
//  */

// /**
//  * Diagnosis object
//  * @typedef {Object} Diagnosis
//  * @property {string} id
//  * @property {string} patientId
//  * @property {string} diagnosis
//  * @property {string} symptoms
//  * @property {'low'|'moderate'|'severe'} severityLevel
//  * @property {string} date
//  */

// /**
//  * Medication object
//  * @typedef {Object} Medication
//  * @property {string} id
//  * @property {string} name
//  * @property {string} quantity
//  * @property {number} sessionsPerDay
//  * @property {'before'|'after'|'with'} foodTiming
//  * @property {string} dosage
//  * @property {string} duration
//  */

// /**
//  * Prescription object
//  * @typedef {Object} Prescription
//  * @property {string} id
//  * @property {string} patientId
//  * @property {string} doctorId
//  * @property {string} diagnosisId
//  * @property {Medication[]} medications
//  * @property {'active'|'completed'} status
//  * @property {string} createdDate
//  * @property {string} [completedDate]
//  */

// /**
//  * User object
//  * @typedef {Object} User
//  * @property {string} id
//  * @property {'admin'|'doctor'} role
//  * @property {string} name
//  * @property {string} email
//  * @property {string} [password]
//  */


// export interface Patient {
//   id: string;
//   name: string;
//   age: number;
//   gender: 'male' | 'female' | 'other';
//   mobile: string;
//   email: string;
//   address: string;
//   doctorId: string;
//   registrationDate: string;
// }

// export interface Diagnosis {
//   id: string;
//   patientId: string;
//   diagnosis: string;
//   symptoms: string;
//   severityLevel: 'low' | 'moderate' | 'severe';
//   date: string;
// }

// export interface Medication {
//   id: string;
//   name: string;
//   quantity: string;
//   sessionsPerDay: number;
//   foodTiming: 'before' | 'after' | 'with';
//   dosage: string;
//   duration: string;
// }

// export interface Prescription {
//   id: string;
//   patientId: string;
//   doctorId: string;
//   diagnosisId: string;
//   medications: Medication[];
//   status: 'active' | 'completed';
//   createdDate: string;
//   completedDate?: string;
// }

// export interface User {
//   id: string;
//   role: 'admin' | 'doctor';
//   name: string;
//   email: string;
//   password?: string;
// }

/**
 * Doctor object
 * @typedef {Object} Doctor
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} phone
 * @property {string} specialization
 * @property {string} licenseNumber
 * @property {string} registrationDate
 * @property {'pending'|'approved'|'rejected'} status
 * @property {string} [password]
 */

/**
 * Patient object
 * @typedef {Object} Patient
 * @property {string} id
 * @property {string} name
 * @property {number} age
 * @property {'male'|'female'|'other'} gender
 * @property {string} mobile
 * @property {string} email
 * @property {string} address
 * @property {string} doctorId
 * @property {string} registrationDate
 */

/**
 * Diagnosis object
 * @typedef {Object} Diagnosis
 * @property {string} id
 * @property {string} patientId
 * @property {string} diagnosis
 * @property {string} symptoms
 * @property {'low'|'moderate'|'severe'} severityLevel
 * @property {string} date
 */

/**
 * Medication object
 * @typedef {Object} Medication
 * @property {string} id
 * @property {string} name
 * @property {string} quantity
 * @property {number} sessionsPerDay
 * @property {'before'|'after'|'with'} foodTiming
 * @property {string} dosage
 * @property {string} duration
 */

/**
 * Prescription object
 * @typedef {Object} Prescription
 * @property {string} id
 * @property {string} patientId
 * @property {string} doctorId
 * @property {string} diagnosisId
 * @property {Medication[]} medications
 * @property {'active'|'completed'} status
 * @property {string} createdDate
 * @property {string} [completedDate]
 */

/**
 * User object
 * @typedef {Object} User
 * @property {string} id
 * @property {'admin'|'doctor'} role
 * @property {string} name
 * @property {string} email
 * @property {string} [password]
 */
