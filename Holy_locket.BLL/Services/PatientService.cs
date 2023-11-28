﻿using AutoMapper;
using Holy_locket.BLL.DTO;
using Holy_locket.BLL.Services.Abstraction;
using Holy_locket.DAL.Abstracts;
using Holy_locket.DAL.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Linq.Expressions;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;

namespace Holy_locket.BLL.Services
{
    public class PatientService : IPatientService
    {
        private readonly IRepository<Patient> _repository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IConfiguration _config;
        public PatientService(IUnitOfWork unitOfWork, IMapper mapper, IConfiguration config)
        {
            _unitOfWork = unitOfWork;
            _repository = unitOfWork.GetRepository<Patient>();
            _mapper = mapper;
            _config = config;
        }
        public async Task CreatePatient(PatientDTO patient)
        {
            await _repository.Create(_mapper.Map<Patient>(patient)).ConfigureAwait(false);
        }
        public async Task DeletePatient(int id)
        {
            await _repository.Delete(id).ConfigureAwait(false);
        }
        public async Task UpdatePatient(PatientDTO patient)
        {
            await _repository.Update(_mapper.Map<Patient>(patient)).ConfigureAwait(false);
        }
        public async Task<PatientDTO> GetPatientById(int id, string token)
        {
            if (await AuthService.CheckToken(token, _config).ConfigureAwait(false))
            {
                var patient = await _repository.GetById(id).ConfigureAwait(false);
                return _mapper.Map<PatientDTO>(patient);
            }
            else
                return null;
        }

        public async Task<string> CheckLogin(string Phone, string Password)
        {
            Expression<Func<Patient, bool>> filter = x => x.Phone == Phone;
            var result = await _repository.Get(filter);
            var patient = _mapper.Map<PatientDTO>(result.FirstOrDefault());
            if (patient == null)
            {
                return null;
            }
            else
            {
                var token = await AuthService.GenerateJSONWebToken(_config).ConfigureAwait(false);
                await AuthService.CheckToken(token, _config);
                return token;
            }
        }

        public void Dispose()
        {
        }
    }
}
