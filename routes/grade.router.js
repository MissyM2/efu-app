'use strict';

const express = require('express');
const passport = require('passport');

const {User} = require('../models/user.model');
const {Term} = require('../models/term.model');
const {Course} = require('../models/course.model');
const {Week} = require('../models/week.model');
const {Grade} = require('../models/grade.model');


const gradeRouter = express.Router();
gradeRouter.use(passport.authenticate('jwt', {session: false}));


// add a new Grade for a given course
gradeRouter.post('/', (req, res) => {
    console.log('inside the grade router', req.body);
    const reqFields = ['termDesc','courseName','weekNum', 'gradeNum'];
    console.log(reqFields);
    const missingField = reqFields.find(field => !(field in req.body));
    console.log(missingField);
    if (missingField) {
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: 'Missing field',
            location: missingField
        });
    }
    console.log('did i make it to after the missingfields?');

    const newGrade = {
            gradeNum: req.body.gradeNum
    };
    
    User.findById(req.user.id)
        .then(user => {
            if (user) {
                newGrade.user = user._id;
                // now that the user is found, find the term
                Term.findOne({termDesc: req.body.termDesc})
                    .then(term => {
                        if (term) {
                            newGrade.term = term._id;
                            console.log('newGrade with userid is', newGrade);

                            // now that the user and term are found, find the week
                            Week.findOne({user:user._id, weekNum: req.body.weekNum})
                                .then(week => {
                                    if (week) {
                                        newGrade.week = week._id;
                                        console.log('newGrade with userid, weekid is', newGrade);
                                        // now that user, term and week are found, find course
                                        Course.findOne({user:user._id, courseName: req.body.courseName})
                                        .then(course => {
                                            if (course) {
                                                newGrade.course = course._id;
                                                console.log('newGrade with userid, weekid, courseid is', newGrade);
                                                // now that all req fields (user, term, week and course are found, create grade)
                                                return Grade.create(newGrade)
                                                    .then(grade => {
                                                        return res.status(201).json({
                                                            id: grade._id,
                                                            studentFullName: `${user.firstname} ${user.lastname}`,
                                                            termDesc: term.termDesc,
                                                            weekNum: week.weekNum,
                                                            courseName: course.courseName,
                                                            gradeNum: grade.gradeNum
                                                        })
                                                    })
                                                    .catch(err => {
                                                        console.error(err);
                                                        return res.status(500).json({error: `${err}`});
                                                    });
                                            } else {
                                                const message = `course not found`;
                                                console.error(message);
                                                return res.status(400).send(message);
                                            }
                                        })
                                        .catch(err => {
                                            console.error(err);
                                            return res.status(500).json({ error: `${err}`});
                                        });

                                    } else {
                                        const message = `week not found`;
                                        console.error(message);
                                        return res.status(400).send(message);
                                    }
                                })
                                .catch (err => {
                                    console.error(err);
                                    return res.status(500).json({ error: `${err}`});
                                });
                        } else {
                            const message = `term not found`;
                            console.error(message);
                            return res.status(500).send(message);
                        }
                    })
                    .catch(err => {
                        console.error(err);
                        return res.status(500).json({ error: `${err}`});
                    });
            } else {
                const message = `user not found`;
                console.error(message);
                return res.status(500).send(message);
            }
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: `${err}`});
        });
});

/*
// get all Grades for selected user
gradeRouter.get('/', (req, res) => {
    console.log(req.user.id);
    User.findById(req.user.id)
        .then (user => {
            Grade.find({user: user._id})
                .then(Grades => {
                    res.status(200).json(
                        Grades.map(Grade => Grade.serialize())
                    )
                })
                .catch(err => {
                    console.log(err);
                    return res.status(500).json({error: `${err}`});
                });
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({error: `${err}`});
        });
});
*/

// find out if a record already exists in the db
gradeRouter.post('/search', (req, res) => {
    var userid = '';
    var termid = '';
    var weekid = '';
    var courseid = '';
    console.log(req.body);
    

    User.findById(req.user.id)
        .then(user => {
            if (user) {
                userid = user._id;
                // now that the user is found, find the term
                Term.findOne({termDesc: req.body.termDesc})
                    .then(term => {
                        if (term) {
                            termid = term._id;
                            // now that the user and term are found, find the week
                            Week.findOne({user:user._id, weekNum: req.body.weekNum})
                                .then(week => {
                                    if (week) {
                                        //console.log(week);
                                        weekid = week._id;
                                        // now that user, term and week are found, find course
                                        Course.findOne({user:user._id, courseName: req.body.courseName})
                                        .then(course => {
                                            if (course) {
                                                courseid = course._id;
                                                console.log('courseid is ', courseid);
                                                // now that all req fields (user, term, week and course are found, create grade)
                                                return Grade.findOne({user:user._id, term:termid, week:weekid, course:courseid})
                                                    .then(grade => {
                                                        if(grade) {
                                                            console.log('after the search, grade it found.  here is the grade ', grade);
                                                            const message = 'there is a grade with this user, term, week and course already';
                                                            console.log(message);
                                                            res.status(200).json({exists: true})
                                                            return true;
                                                        } else {

                                                            console.log('after the search, grade is not found. here is the grade ', grade);
                                                            const message = 'grade not found.  you may add the grade';
                                                            console.log(message);
                                                            res.status(200).json({exists: false});
                                                            return false;
                                                        }
                                                    })
                                                    .catch(err => {
                                                        console.error(err);
                                                        return res.status(500).json({error: `${err}`});
                                                    });
                                            } else {
                                                const message = `course not found`;
                                                console.error(message);
                                                return res.status(400).send(message);
                                            }
                                        })
                                        .catch(err => {
                                            console.error(err);
                                            return res.status(500).json({ error: `${err}`});
                                        });

                                    } else {
                                        const message = `week not found`;
                                        console.error(message);
                                        return res.status(400).send(message);
                                    }
                                })
                                .catch (err => {
                                    console.error(err);
                                    return res.status(500).json({ error: `${err}`});
                                });
                        } else {
                            const message = `term not found`;
                            console.error(message);
                            return res.status(500).send(message);
                        }
                    })
                    .catch(err => {
                        console.error(err);
                        return res.status(500).json({ error: `${err}`});
                    });
            } else {
                const message = `user not found`;
                console.error(message);
                return res.status(500).send(message);
            }
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: `${err}`});
        });
});






// update a Grade for a given course, for a given week, for a given term for a given user
gradeRouter.put('/', (req, res) => {
    const reqFields = ['termDesc','courseName','weekNum', 'oldgradeNum','newgradeNum'];
    const missingField = reqFields.find(field => !(field in req.body));
    if (missingField) {
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: 'Missing field',
            location: missingField
        });
    }

    const updatedGrade = {
            gradeNum: req.body.newgradeNum
    };
    
    User.findById(req.user.id)
        .then(user => {
            if (user) {
                updatedGrade.user = user._id;
                // now that the user is found, find the term
                Term.findOne({termDesc: req.body.termDesc})
                    .then(term => {
                        if (term) {
                            updatedGrade.term = term._id;
                            console.log('updatedGrade with userid is', updatedGrade);

                            // now that the user and term are found, find the week
                            Week.findOne({user:user._id, weekNum: req.body.weekNum})
                                .then(week => {
                                    if (week) {
                                        updatedGrade.week = week._id;
                                        // now that user, term and week are found, find course
                                        Course.findOne({user:user._id, term: term._id, courseName: req.body.courseName})
                                        .then(course => {
                                            if (course) {
                                                updatedGrade.course= course._id;
                                                // now that all req fields (user, term, week and course are found, find grade)
                                                Grade.findOne({user:user._id, term: term._id, week: week._id, course:course._id, gradeNum: req.body.oldgradeNum})
                                                    .then(grade => {
                                                        if (grade) {
                                                            Grade.findOneAndUpdate({_id: grade._id}, updatedGrade, {new: true})
                                                                .then(newgrade => {
                                                                    res.status(200).json(newgrade)
                                                                })
                                                                .catch(err => {
                                                                    console.error(err);
                                                                    return res.status(500).json({error: `${err}`});
                                                                });
                                                        } else {
                                                            const message = 'grade not found';
                                                            console.error(message);
                                                            return res.status(400).send(message);
                                                        }
                                                    })
                                               
                                            } else {
                                                const message = `course not found`;
                                                console.error(message);
                                                return res.status(400).send(message);
                                            }
                                        })
                                        .catch(err => {
                                            console.error(err);
                                            return res.status(500).json({ error: `${err}`});
                                        });

                                    } else {
                                        const message = `week not found`;
                                        console.error(message);
                                        return res.status(400).send(message);
                                    }
                                })
                                .catch (err => {
                                    console.error(err);
                                    return res.status(500).json({ error: `${err}`});
                                });
                        } else {
                            const message = `term not found`;
                            console.error(message);
                            return res.status(500).send(message);
                        }
                    })
                    .catch(err => {
                        console.error(err);
                        return res.status(500).json({ error: `${err}`});
                    });
            } else {
                const message = `user not found`;
                console.error(message);
                return res.status(500).send(message);
            }
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: `${err}`});
        });
});


module.exports = {gradeRouter};