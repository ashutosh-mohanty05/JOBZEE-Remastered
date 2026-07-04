import React, { useContext, useEffect, useState } from "react";
import api from "../../utils/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Context } from "../../main";
const PostJob = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [location, setLocation] = useState("");
  const [salaryFrom, setSalaryFrom] = useState("");
  const [salaryTo, setSalaryTo] = useState("");
  const [fixedSalary, setFixedSalary] = useState("");
  const [salaryType, setSalaryType] = useState("default");

  const { isAuthorized, user } = useContext(Context);

  const handleJobPost = async (e) => {
    e.preventDefault();
    if (salaryType === "Fixed Salary") {
      setSalaryFrom("");
      setSalaryTo("");
    } else if (salaryType === "Ranged Salary") {
      setFixedSalary("");
    } else {
      setSalaryFrom("");
      setSalaryTo("");
      setFixedSalary("");
    }
    await api
      .post(
        "/job/post",
        fixedSalary.length >= 4
          ? {
              title,
              description,
              category,
              country,
              city,
              location,
              fixedSalary,
            }
          : {
              title,
              description,
              category,
              country,
              city,
              location,
              salaryFrom,
              salaryTo,
            },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        toast.success(res.data.message);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  const navigateTo = useNavigate();
  if (!isAuthorized || (user && user.role !== "Employer")) {
    navigateTo("/");
  }

  return (
    <>
      <div className="job_post page">
        <div className="container">
          <h3>POST NEW JOB</h3>
          <form onSubmit={handleJobPost}>
            <div className="wrapper">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Job Title"
              />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select Category</option>

                <optgroup label="Technology & IT">
                  <option value="Frontend Web Development">Frontend Web Development</option>
                  <option value="Backend Web Development">Backend Web Development</option>
                  <option value="Full Stack Development">Full Stack Development</option>
                  <option value="MERN Stack Development">MERN Stack Development</option>
                  <option value="MEAN Stack Development">MEAN Stack Development</option>
                  <option value="MEVN Stack Development">MEVN Stack Development</option>
                  <option value="Mobile App Development">Mobile App Development</option>
                  <option value="iOS Development">iOS Development</option>
                  <option value="Android Development">Android Development</option>
                  <option value="Artificial Intelligence">Artificial Intelligence</option>
                  <option value="Machine Learning">Machine Learning</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Data Engineering">Data Engineering</option>
                  <option value="Data Analytics">Data Analytics</option>
                  <option value="DevOps Engineering">DevOps Engineering</option>
                  <option value="Cloud Computing">Cloud Computing</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="QA & Software Testing">QA & Software Testing</option>
                  <option value="Database Administration">Database Administration</option>
                  <option value="Blockchain Development">Blockchain Development</option>
                  <option value="Game Development">Game Development</option>
                  <option value="Embedded Systems">Embedded Systems</option>
                  <option value="IT Support & Helpdesk">IT Support & Helpdesk</option>
                  <option value="Network Administration">Network Administration</option>
                  <option value="Data Entry Operator">Data Entry Operator</option>
                </optgroup>

                <optgroup label="Design & Creative">
                  <option value="Graphics & Design">Graphics & Design</option>
                  <option value="UI/UX Design">UI/UX Design</option>
                  <option value="Product Design">Product Design</option>
                  <option value="Video Animation">Video Animation</option>
                  <option value="Video Editing">Video Editing</option>
                  <option value="Photography">Photography</option>
                  <option value="Illustration">Illustration</option>
                  <option value="Interior Design">Interior Design</option>
                  <option value="Fashion Design">Fashion Design</option>
                </optgroup>

                <optgroup label="Marketing & Sales">
                  <option value="Digital Marketing">Digital Marketing</option>
                  <option value="SEO Specialist">SEO Specialist</option>
                  <option value="Social Media Marketing">Social Media Marketing</option>
                  <option value="Content Marketing">Content Marketing</option>
                  <option value="Email Marketing">Email Marketing</option>
                  <option value="Sales Executive">Sales Executive</option>
                  <option value="Business Development">Business Development</option>
                  <option value="Public Relations">Public Relations</option>
                  <option value="Brand Management">Brand Management</option>
                </optgroup>

                <optgroup label="Writing & Content">
                  <option value="Content Writing">Content Writing</option>
                  <option value="Copywriting">Copywriting</option>
                  <option value="Technical Writing">Technical Writing</option>
                  <option value="Editing & Proofreading">Editing & Proofreading</option>
                  <option value="Translation">Translation</option>
                </optgroup>

                <optgroup label="Business & Finance">
                  <option value="Account & Finance">Account & Finance</option>
                  <option value="Accounting">Accounting</option>
                  <option value="Financial Analysis">Financial Analysis</option>
                  <option value="Investment Banking">Investment Banking</option>
                  <option value="Business Analysis">Business Analysis</option>
                  <option value="Project Management">Project Management</option>
                  <option value="Product Management">Product Management</option>
                  <option value="Operations Management">Operations Management</option>
                  <option value="Consulting">Consulting</option>
                  <option value="Supply Chain & Logistics">Supply Chain & Logistics</option>
                </optgroup>

                <optgroup label="HR & Administration">
                  <option value="Human Resources">Human Resources</option>
                  <option value="Recruiting & Talent Acquisition">Recruiting & Talent Acquisition</option>
                  <option value="Office Administration">Office Administration</option>
                  <option value="Executive Assistant">Executive Assistant</option>
                </optgroup>

                <optgroup label="Customer Support">
                  <option value="Customer Service">Customer Service</option>
                  <option value="Technical Support">Technical Support</option>
                  <option value="Call Center">Call Center</option>
                  <option value="Virtual Assistant">Virtual Assistant</option>
                </optgroup>

                <optgroup label="Healthcare">
                  <option value="Nursing">Nursing</option>
                  <option value="Medical & Healthcare">Medical & Healthcare</option>
                  <option value="Pharmacy">Pharmacy</option>
                  <option value="Mental Health & Counseling">Mental Health & Counseling</option>
                  <option value="Physical Therapy">Physical Therapy</option>
                </optgroup>

                <optgroup label="Education & Training">
                  <option value="Teaching">Teaching</option>
                  <option value="Corporate Training">Corporate Training</option>
                  <option value="Curriculum Development">Curriculum Development</option>
                  <option value="Academic Research">Academic Research</option>
                </optgroup>

                <optgroup label="Legal">
                  <option value="Legal Services">Legal Services</option>
                  <option value="Paralegal">Paralegal</option>
                  <option value="Compliance">Compliance</option>
                </optgroup>

                <optgroup label="Engineering & Manufacturing">
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Civil Engineering">Civil Engineering</option>
                  <option value="Electrical Engineering">Electrical Engineering</option>
                  <option value="Chemical Engineering">Chemical Engineering</option>
                  <option value="Manufacturing & Production">Manufacturing & Production</option>
                  <option value="Quality Assurance (Manufacturing)">Quality Assurance (Manufacturing)</option>
                  <option value="Architecture">Architecture</option>
                </optgroup>

                <optgroup label="Hospitality, Retail & Trades">
                  <option value="Hospitality & Tourism">Hospitality & Tourism</option>
                  <option value="Retail">Retail</option>
                  <option value="Food & Beverage">Food & Beverage</option>
                  <option value="Event Management">Event Management</option>
                  <option value="Construction & Skilled Trades">Construction & Skilled Trades</option>
                  <option value="Driving & Delivery">Driving & Delivery</option>
                  <option value="Security Services">Security Services</option>
                </optgroup>

                <optgroup label="Other">
                  <option value="Non-Profit & Social Work">Non-Profit & Social Work</option>
                  <option value="Agriculture">Agriculture</option>
                  <option value="Real Estate">Real Estate</option>
                  <option value="Sports & Fitness">Sports & Fitness</option>
                  <option value="Other">Other</option>
                </optgroup>
              </select>
            </div>
            <div className="wrapper">
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Country"
              />
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
              />
            </div>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location"
            />
            <div className="salary_wrapper">
              <select
                value={salaryType}
                onChange={(e) => setSalaryType(e.target.value)}
              >
                <option value="default">Select Salary Type</option>
                <option value="Fixed Salary">Fixed Salary</option>
                <option value="Ranged Salary">Ranged Salary</option>
              </select>
              <div>
                {salaryType === "default" ? (
                  <p>Please provide Salary Type *</p>
                ) : salaryType === "Fixed Salary" ? (
                  <input
                    type="number"
                    placeholder="Enter Fixed Salary"
                    value={fixedSalary}
                    onChange={(e) => setFixedSalary(e.target.value)}
                  />
                ) : (
                  <div className="ranged_salary">
                    <input
                      type="number"
                      placeholder="Salary From"
                      value={salaryFrom}
                      onChange={(e) => setSalaryFrom(e.target.value)}
                    />
                    <input
                      type="number"
                      placeholder="Salary To"
                      value={salaryTo}
                      onChange={(e) => setSalaryTo(e.target.value)}
                    />
                  </div>
                )}
              </div>
            </div>
            <textarea
              rows="10"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Job Description"
            />
            <button type="submit">Create Job</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default PostJob;
