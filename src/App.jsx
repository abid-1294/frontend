import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [inputBlog, setInputBlog] = useState({
    name: '',
    author: '',
    description: '',
    image: '',
  });

  const [showBlog, setShowBlog] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setInputBlog((inputBlog) => ({
      ...inputBlog,
      [name]: files ? files[0] : value,
    })); // Update the state with the correct field
  };

  // Submitting Blog
  const handleSubmitBlog = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', inputBlog.name);
    formData.append('author', inputBlog.author);
    formData.append('description', inputBlog.description);
    formData.append('image', inputBlog.image);

    try {
      const response = await axios.post(
        'https://backend-nt45.onrender.com/api/v1/blog/createblog',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      console.log('Response from server:', response.data);
      setInputBlog({ name: '', author: '', description: '', image: '' });
      fetchBlog();
    } catch (error) {
      console.error('Error creating blog:', error);
    }
  };

  // Showing All Blog
  const fetchBlog = async () => {
    try {
      const response = await fetch('https://backend-nt45.onrender.com/api/v1/blog/getallblog');
      const data = await response.json();
      console.log('Fetched Blogs:', data); // Debug: log the fetched data
      setShowBlog(data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  useEffect(() => {
    fetchBlog(); // Fetch blogs on component mount
  }, []);

  // Open Modal with blog details
  const handleOpenModal = (blog) => {
    setSelectedBlog(blog);
    setIsModalOpen(true);
  };

  // Close Modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBlog(null);
  };

  return (
    <>
      <div className='bg-[#FFFFF0] border-8 w-full absolute top-0 left-0 h-screen overflow-x-hidden overflow-y-auto border-slate-950 custom-scrollbar'>
        <div className='mx-auto container bg-[#FFFFF0]'>
          <p className='text-center text-[30px]'>Blog</p>
          <div className='mx-auto block py-[50px] px-[25px]'>
            <form className='flex flex-col gap-y-5' onSubmit={handleSubmitBlog}>
              <input
                name='name'
                value={inputBlog.name} // Set the current value of name input
                onChange={handleChange}
                type='text'
                placeholder='Blog Name'
                className='w-[250px] px-5 py-3 border rounded-xl'
              />

              <input
                name='author'
                value={inputBlog.author} // Set the current value of author input
                onChange={handleChange}
                type='text'
                placeholder='Author Name'
                className='w-[250px] px-5 py-3 border rounded-xl'
              />
              <div className="w-[250px] bg-[#FFFFFF] flex items-center border border-gray-300 p-2 rounded-lg mb-4">
                <span className="text-gray-600 flex-grow">Image</span>
                <label className="bg-gray-200 ml-[10px] text-gray-700 py-1 px-4 rounded-2xl cursor-pointer">
                  Upload
                  <input
                    type="file"
                    name="image"
                    onChange={handleChange}
                    className="w-[250px]  px-5 py-3 border rounded-xl hidden"
                  />
                </label>
              </div>

              <input
                name='description'
                value={inputBlog.description} // Set the current value of description input
                onChange={handleChange}
                type='text'
                placeholder='Blog Description'
                className='w-[550px] h-[150px] px-5 py-3 border rounded-xl'
              />

              <button
                type='submit'
                className='w-[120px] h-[40px] bg-amber-500 hover:bg-orange-200 border border-gray-800 rounded-[20px] shadow-2xl transition-all duration-300 hover:p-[5px] hover:shadow-amber-500 font-bold'
              >
                Submit
              </button>
            </form>
          </div>

          <div className='mt-[10px]'>
            <div className='mx-auto grid grid-cols-4 gap-[30px] mt-[22px] justify-around'>
              {Array.isArray(showBlog) && showBlog.length > 0 ? (
                showBlog.map((blog, index) => (
                  <div
                    key={index}
                    onClick={() => handleOpenModal(blog)}
                    className='col-span-1 w-[300px] h-[380px] rounded-[20px] shadow-2xl transition-all duration-300 hover:shadow-amber-500 group cursor-pointer'
                  >
                    <div>
                      <img src={blog.image} alt="" className='p-5 transition-all duration-300 group-hover:p-0 w-full h-[200px] object-cover rounded-t-[20px] rounded-b-[20px] group-hover:rounded-b-[0px]' />
                    </div>
                    <div className='w-full p-5'>
                      <p className='font-bold text-[22px]'>{blog.name}</p>
                      <p className='font-semibold mt-2'>
                        Author: <span>{blog.author}</span>
                      </p>
                      <p className='mt-3 text-[18px]'>{blog.description}</p>
                      <p className='text-right'>{new Date(blog.created).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className=' text-red-600'>No blogs available</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Component */}
      {isModalOpen && selectedBlog && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
          <div className='bg-white p-6 rounded-lg shadow-lg w-[80%] max-w-[600px]'>
            <button onClick={handleCloseModal} className='absolute top-2 right-2 text-xl'>×</button>
            <h2 className='text-2xl font-bold mb-4'>{selectedBlog.name}</h2>
            <img src={selectedBlog.image} alt="" className='w-full h-[300px] object-cover mb-4' />
            <p className='text-lg mb-2'><strong>Author:</strong> {selectedBlog.author}</p>
            <p className='text-lg mb-4 text-ellipsis overflow-hidden whitespace-nowrap'><strong>Description:</strong> {selectedBlog.description}</p>
            <p className='text-lg'><strong>Created:</strong> {new Date(selectedBlog.created).toLocaleDateString()}</p>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
