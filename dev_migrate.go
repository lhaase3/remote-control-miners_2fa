package main

import (
	"errors"
	"fmt"
	"os"

	fleet_repo "foxhound/internal/infrastructure/database/repositories/fleet"
	miner_repo "foxhound/internal/infrastructure/database/repositories/miner"
	scanner_repo "foxhound/internal/infrastructure/database/repositories/scanner"

	miner_domain "foxhound/internal/application/miner/domain"
	scanner_domain "foxhound/internal/application/scanner/domain"

	"gorm.io/gorm"
)

func DevMigrate(db *gorm.DB) error {
	fleet := fleet_repo.Fleet{
		Name: "test_fleet",
	}

	err := db.First(&fleet, "name = ?", fleet.Name).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		err := db.Create(&fleet).Error
		if err != nil {
			fmt.Println("ERROR IN FLEET", err)
			return err
		}
	}

	fmt.Println("fleet ID", fleet.ID)

	miners := []miner_repo.Miner{
		{
			Miner: miner_domain.Miner{
				MacAddress: "00:1A:2B:3C:4D:5E",
				IPAddress:  "10.0.1.100",
			},
			Stats: miner_domain.Stats{
				HashRate:  5000.0,
				RateIdeal: 5200.0,
				Uptime:    100000,
			},
			Config: miner_domain.Config{
				Username: "user",
				Password: "pass",
				Firmware: "v1.2.3",
			},
			Mode:   miner_domain.NormalMode,
			Status: miner_domain.Online,
			// NOTE: associated models for miner
			Pools: []miner_repo.Pool{
				{
					Pool: miner_domain.Pool{
						Url:      "http://pool1.com",
						User:     "pool_user",
						Pass:     "pool_pass",
						Status:   "Active",
						Accepted: 10,
						Rejected: 50,
						Stale:    100,
					},
				},
				{
					Pool: miner_domain.Pool{
						Url:      "http://pool2.com",
						User:     "pool_user",
						Pass:     "pool_pass",
						Status:   "Active",
						Accepted: 430,
						Rejected: 50,
						Stale:    10,
					},
				},
				{
					Pool: miner_domain.Pool{
						Url:      "http://pool3.com",
						User:     "pool_user",
						Pass:     "pool_pass",
						Status:   "Active",
						Accepted: 630,
						Rejected: 90,
						Stale:    100,
					},
				},
			},
			Temperature: []miner_repo.TemperatureSensor{
				{
					Name: "chain 1",
					PcbSensors: []miner_repo.PcbSensor{
						{
							PcbSensor: miner_domain.PcbSensor{
								Temperature: 50,
							},
						},
						{
							PcbSensor: miner_domain.PcbSensor{
								Temperature: 40,
							},
						},
						{
							PcbSensor: miner_domain.PcbSensor{
								Temperature: 40,
							},
						},
					},
				},
				{
					Name: "chain 2",
					PcbSensors: []miner_repo.PcbSensor{
						{
							PcbSensor: miner_domain.PcbSensor{
								Temperature: 50,
							},
						},
						{
							PcbSensor: miner_domain.PcbSensor{
								Temperature: 40,
							},
						},
						{
							PcbSensor: miner_domain.PcbSensor{
								Temperature: 49,
							},
						},
					},
				},
				{
					Name: "chain 3",
					PcbSensors: []miner_repo.PcbSensor{
						{
							PcbSensor: miner_domain.PcbSensor{
								Temperature: 50,
							},
						},
						{
							PcbSensor: miner_domain.PcbSensor{
								Temperature: 40,
							},
						},
						{
							PcbSensor: miner_domain.PcbSensor{
								Temperature: 44,
							},
						},
					},
				},
			},
			Fan: []miner_repo.FanSensor{
				{
					Sensor: miner_domain.FanSensor{
						Name:  "fan 1",
						Speed: 100,
					},
				},
				{
					Sensor: miner_domain.FanSensor{
						Name:  "fan 2",
						Speed: 120,
					},
				},
				{
					Sensor: miner_domain.FanSensor{
						Name:  "fan 3",
						Speed: 180,
					},
				},
			},
			FleetID: fleet.ID,
		},
	}

	// TODO: batch or tx. operation
	for _, miner := range miners {
		result := db.Where("mac_address = ?", miner.Miner.MacAddress).First(&miner.Miner)

		if result.RowsAffected == 0 {
			err := db.Create(&miner).Error
			fmt.Println("ERROR IN ROWS", err)
		}
	}

	start_ip := os.Getenv("START_IP")
	end_ip := os.Getenv("END_IP")

	temp_user := os.Getenv("TEMP_USER")
	temp_pass := os.Getenv("TEMP_PASS")

	scanner := scanner_repo.Scanner{
		Name: "scanner test",
		Scanner: scanner_domain.Scanner{
			StartIP:  start_ip,
			EndIP:    end_ip,
			Active:   true,
			Location: "TEST LOCATION",
		},
		Config: scanner_domain.Config{
			Interval: 5,
			Username: temp_user,
			Password: temp_pass,
		},
		MinerType: scanner_domain.AntminerCgi,
		Owner:     "test owner",
		FleetID:   fleet.ID,
	}

	result := db.Where("name = ?", scanner.Name).First(&scanner)
	if result.RowsAffected == 0 {
		err := db.Create(&scanner).Error
		fmt.Println("ERROR IN ROWS", err)
	}

	alertA := scanner_repo.Alert{
		Name:   "alert A",
		Action: scanner_domain.Reboot,
		Condition: []scanner_repo.AlertCondition{
			{
				TriggerValue:  50,                  // 50 TH/s
				MachineCount:  100,                 // 100 machines
				ThresholdType: scanner_domain.Rate, // %
				ConditionType: scanner_domain.Hashrate,
				LayerType:     scanner_domain.InfoAlert,
			},
		},

		Log: []scanner_repo.AlertLog{
			{
				Log: "test log from a",
			},
		},
		ScannerID: scanner.ID,
	}
	alertB := scanner_repo.Alert{
		Name:   "alert B",
		Action: scanner_domain.Sleep,
		Condition: []scanner_repo.AlertCondition{
			{
				TriggerValue:  80,                   // 80C
				MachineCount:  100,                  // 100 machines
				ThresholdType: scanner_domain.Count, // machines
				ConditionType: scanner_domain.Temperature,
				LayerType:     scanner_domain.InfoAlert,
			},
		},
		Log: []scanner_repo.AlertLog{
			{
				Log: "test log from b",
			},
		},
		ScannerID: scanner.ID,
	}

	result = db.Where("name = ?", alertA.Name).First(&alertA)
	if result.RowsAffected == 0 {
		db.Create(&alertA)
	}

	result = db.Where("name = ?", alertB.Name).First(&alertB)
	if result.RowsAffected == 0 {
		db.Create(&alertB)
	}

	return nil
}
