import React from 'react';

const App = () => {
  return (
    <div className="bg-gray-100 min-h-screen text-gray-800">
      <header className="bg-egg px-8 py-4">
        <h1 className="text-4xl font-bold">MD. Golam Rabbani Abir</h1>
        <p className="text-lg">Researcher | Data Scientist | Developer</p>
        <div className="mt-4 space-x-4">
          <a href="https://www.linkedin.com/in/golam-rabbani-abir-126587211/" target="_blank" rel="noopener noreferrer" className="text-blue-600">LinkedIn</a>
          <a href="https://github.com/Abir0606" target="_blank" rel="noopener noreferrer" className="text-gray-600">GitHub</a>
        </div>
      </header>

      <main className="px-8 py-8">
        {/* Research Section */}
        <section className="my-8">
          <h2 className="text-3xl font-semibold mb-4">Research</h2>
          <ul className="space-y-4">
            <li>
              <h3 className="text-xl font-semibold">Advancing Low-Light Object Detection with YOLO Models</h3>
              <p className="text-gray-600">Second author | <a href="https://doi.org/10.1049/ccs2.12114" className="text-blue-500">DOI</a></p>
            </li>
            <li>
              <h3 className="text-xl font-semibold">Detection of Brain Tumor using CNN Architecture</h3>
              <p className="text-gray-600">First author</p>
            </li>
            {/* Add more research papers here */}
          </ul>
        </section>

        {/* Projects Section */}
        <section className="my-8">
          <h2 className="text-3xl font-semibold mb-4">Projects</h2>
          <ul className="space-y-4">
            <li>
              <h3 className="text-xl font-semibold">Brain Tumor Classification using CNN</h3>
              <p className="text-gray-600">Developed a CNN model using TensorFlow and Keras.</p>
              <a href="https://github.com/Abir0606/Brain-Tumor-Classification-using-CNN" className="text-blue-500">GitHub Repository</a>
            </li>
            <li>
              <h3 className="text-xl font-semibold">House Rent Prediction</h3>
              <p className="text-gray-600">Implemented linear regression with 86% accuracy.</p>
              <a href="https://github.com/Abir0606/House-Rent-Prediction" className="text-blue-500">GitHub Repository</a>
            </li>
            {/* Add more projects here */}
          </ul>
        </section>

        {/* Achievements Section */}
        <section className="my-8">
          <h2 className="text-3xl font-semibold mb-4">Achievements</h2>
          <ul className="space-y-4">
            <li>
              <h3 className="text-xl font-semibold">Published 4 Research Papers</h3>
              <p className="text-gray-600">AMIR Lab, Bangladesh University of Business and Technology</p>
            </li>
            {/* Add more achievements here */}
          </ul>
        </section>
      </main>

      <footer className="bg-gray-200 py-4 text-center">
        <p>© 2024 MD. Golam Rabbani Abir</p>
      </footer>
    </div>
  );
}

export default App;