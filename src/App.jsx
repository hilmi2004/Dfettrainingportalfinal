import React from 'react';
import Landingpage from "./Components/Landingpage.jsx";
import Footer from "./Components/Footer.jsx";
import Registrationpage from "./Components/Registrationpage.jsx";
import Astudent from "./Components/Astudent.jsx";
import Testimonial from "@/Components/Testimonial.jsx";
import {motion} from "framer-motion";
import Faq from "@/Components/Faq.jsx";
import Login from "@/pages/Login.jsx";


const sectionVariants = {
    hidden: { opacity: 0, y: 50 }, // Start slightly lower and invisible
    visible: { opacity: 1, y: 0 }, // Fade in and move to normal position
};

const transition = { duration: 0.8, ease: "easeInOut" }; // Smooth transition

const App = () => {
    return (
        
        
        <div>

            <motion.div
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                transition={transition}
                viewport={{ once: true, amount: 0.2 }} // Triggers when 20% of the section is visible
            >
                <Landingpage/>
            </motion.div>

            <motion.div
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                transition={transition}
                viewport={{ once: true, amount: 0.2 }} // Triggers when 20% of the section is visible
            ><Registrationpage/></motion.div>

            <motion.div
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                transition={transition}
                viewport={{ once: true, amount: 0.2 }} // Triggers when 20% of the section is visible
                >
                <Astudent/>
            </motion.div>

            <motion.div
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                transition={transition}
                viewport={{ once: true, amount: 0.2 }} // Triggers when 20% of the section is visible
                >
                <Testimonial/>
            </motion.div>

            <motion.div
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                transition={transition}
                viewport={{ once: true, amount: 0.2 }} // Triggers when 20% of the section is visible
            >
                <Faq/>
            </motion.div>



            <motion.div variants={sectionVariants} initial={"hidden"} whileInView={"visible"} transition={transition} viewport={{once:true,amount:0.2}}>
                <Footer/>
            </motion.div>

            <Login/>

        

        </div>
    );
};

export default App;