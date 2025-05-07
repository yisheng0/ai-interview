'use client';

import { Grid, TextField } from '@mui/material';

interface PersonalData {
  name: string;
  phone: string;
  email: string;
}

interface PersonalInfoProps {
  data: PersonalData;
  onChange: (data: PersonalData) => void;
}

/**
 * 个人信息表单组件
 * 包含姓名、电话和邮箱输入框
 */
export default function PersonalInfo({ data, onChange }: PersonalInfoProps) {
  const handleChange = (field: keyof PersonalData) => (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...data,
      [field]: event.target.value
    });
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          required
          id="name"
          name="name"
          label="姓名"
          value={data.name}
          onChange={handleChange('name')}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          required
          id="phone"
          name="phone"
          label="电话"
          value={data.phone}
          onChange={handleChange('phone')}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          required
          id="email"
          name="email"
          label="邮箱"
          type="email"
          value={data.email}
          onChange={handleChange('email')}
        />
      </Grid>
    </Grid>
  );
} 