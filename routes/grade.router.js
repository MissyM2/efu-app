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
    const reqFields = ['termDesc','courseName','weekNum', 'gradeNum'];
    const missingField = reqFields.find(field => !(field in req.body));
    if (missingField) {
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: 'Missing field',
            location: missingField
        });
    }

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

                            // now that the user and term are found, find the week
                            Week.findOne({user:user._id, weekNum: req.body.weekNum})
                                .then(week => {
                                    if (week) {
                                        newGrade.week = week._id;
                                        // now that user, term and week are found, find course
                                        Course.findOne({user:user._id, courseName: req.body.courseName})
                                        .then(course => {
                                            if (course) {
                                                newGrade.course = course._id;
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


// get all Grades for selected user
// grades for course and week are handled on the front-end in the component
gradeRouter.get('/', (req, res) => {
    console.log('just inside get');
    User.findById(req.user.id)
        .then (user => {
            console.log('found user, now get grades');
            Grade.find({user: user._id})
                .then(grades => {
                    console.log('show grades', grades);
                    res.status(200).json(
                        grades.map(grade => grade.serialize())
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


// find out if a record already exists in the db
gradeRouter.post('/search', (req, res) => {
    var userid = '';
    var termid = '';
    var weekid = '';
    var courseid = '';
    

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
                                        weekid = week._id;
                                        // now that user, term and week are found, find course
                                        Course.findOne({user:user._id, courseName: req.body.courseName})
                                        .then(course => {
                                            if (course) {
                                                courseid = course._id;
                                                // now that all req fields (user, term, week and course are found, create grade)
                                                return Grade.findOne({user:user._id, term:termid, week:weekid, course:courseid})
                                                    .then(grade => {
                                                        if(grade) {
                                                            const message = 'there is a grade with this user, term, week and course already';
                                                            console.log(message);
                                                            res.status(200).json({exists: true})
                                                            return true;
                                                        } else {
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

//delete route for grade with proper courseName, termDesc and user
gradeRouter.delete('/', (req, res) => {
    console.log('made it to gradeRouter.delete');
    const reqFields = ['termDesc', 'courseName'];
    const missingField = reqFields.find(field => !(field in req.body));
    if (missingField) {
        return res.status(422).json({
            code: 422, 
            reason: 'ValidationError', 
            message: 'Missing field', 
            location: missingField
        });
    }
    
     User.findById(req.user.id)
         .then(user => {
             if (user) {
                 const userID = user._id;
                 Term.findOne({termDesc: req.body.termDesc})
                     .then(term => {
                         if (term) {
                             const termID = term._id
                             Course.findOne({courseName: req.body.courseName})
                                 .then(course => {
                                    const courseID= course._id
                                     if (course) {
                                         Grade.remove({
                                            user: userID,
                                            term: termID,
                                            course: courseID
                                            })
                                            .then(() => {
                                                console.log('all grades for the following course/term/user have been removed properly');
                                                   
                                           })
                                            .catch(err => {
                                                return res.status(500).json({error: `${err}`});
                                            });
                                    } else {
                                        const message = 'course not found';
                                        console.error(message);
                                        return res.status(400).send(message);
                                    }
                                })
                                .catch(err => {
                                    console.error(err);
                                    return res.status(500).json({error: `${err}`});
                                }); 
                        } else {
                            const message = `term not found`;
                            console.error(message);
                            return res.status(400).send(message);
                        }
                    })
                    .catch (err => {
                        console.error(err);
                        return res.status(500).json({error: `${err}`});
                    }); 
            } else {
                const message = `user not found`;
                console.error(message);
                return res.status(400).send(message);
            }
        })
        .catch(err => {
            return res.status(500).json({ error: `${err}`});
        });
});


module.exports = {gradeRouter};