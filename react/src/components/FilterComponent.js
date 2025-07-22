import React, { useState } from 'react';
import { Form, Select, Slider, Button } from 'antd';
import '../App.css';

const { Option } = Select;

const FilterComponent = ({ onFilterChange }) => {
  const [form] = Form.useForm();
  const [gender, setGender] = useState('');
  const [ageRange, setAgeRange] = useState([18, 60]);

  const handleFilterSubmit = () => {
    onFilterChange({
      gender,
      minAge: ageRange[0],
      maxAge: ageRange[1],
    });
  };

  const handleGenderChange = (value) => {
    setGender(value);
  };

  const handleAgeChange = (value) => {
    setAgeRange(value);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Фильтр фотографий</h2>
      <Form form={form} layout="vertical">
        <Form.Item label="Пол">
          <Select
            placeholder="Выберите пол"
            onChange={handleGenderChange}
            value={gender}
            allowClear
          >
            <Option value="male">Мужской</Option>
            <Option value="female">Женский</Option>
            <Option value="other">Другое</Option>
          </Select>
        </Form.Item>
        <Form.Item label="Возрастной диапазон">
          <Slider
            range
            min={18}
            max={100}
            value={ageRange}
            onChange={handleAgeChange}
            marks={{ 18: '18', 100: '100+' }}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={handleFilterSubmit} style={{ width: '100%' }}>
            Применить фильтр
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default FilterComponent;
