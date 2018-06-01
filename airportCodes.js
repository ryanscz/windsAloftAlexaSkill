const westCoast = [
  "BIH",
  "BLH",
  "FAT",
  "FOT",
  "ONT",
  "RBL",
  "SAC",
  "SAN",
  "SBA",
  "SFO",
  "SIY",
  "WJF",
  "AST",
  "IMB",
  "LKV",
  "OTH",
  "PDX",
  "RDM",
  "GEG",
  "SEA",
  "YKM"
]

const mountain = ["PHX", "PRC", "TUS", "ALS", "DEN", "GJT", "PUB", "BOI", "LWS", "PIH", "BIL", "DLN", "GGW", "GPI", "GTF", "MLS", "BAM", "ELY", "LAS", "RNO", "ABQ", "FMN", "ROW", "TCC", "ZUN", "BCE", "SLC", "CZI", "LND", "MBW", "RKS"]

const deepSouth = ["BHM", "HSV", "MGM", "MOB", "FSM", "LIT", "LCH", "MSY", "SHV", "JAN", "GAG", "OKC", "TUL", "BNA", "MEM", "TRI", "TYS", "ABI", "AMA", "BRO", "CLL", "CRP", "DAL", "DRT", "ELP", "HOU", "INK", "LBB", "LRD", "MRF", "PSX", "SAT", "SPS", "T01", "T06", "T07", "4J3", "H51", "H52", "H61"]

const south = ["EYW", "JAX", "MIA", "MLB", "PFN", "PIE", "TLH", "ATL", "CSG", "SAV", "HAT", "ILM", "RDU", "CAE", "CHS", "FLO", "GSP", "2XG"]

const midwest = ["BRL", "DBQ", "DSM", "MCW", "JOT", "SPI", "EVV", "FWA", "IND", "GCK", "GLD", "ICT", "SLN", "LOU", "ECK", "MKG", "MQT", "SSM", "TVC", "AXN", "DLH", "INL", "MSP", "CGI", "COU", "MKC", "SGF", "STL", "DIK", "GFK", "MOT", "BFF", "GRI", "OMA", "ONL", "ABR", "FSD", "PIR", "RAP", "GRB", "LSE"]

const northeast = ["BDL", "BGR", "CAR", "PWM", "EMI", "ACK", "BOS", "BML", "ACY", "ALB", "BUF", "JFK", "PLB", "SYR", "CLE", "CMH", "CVG", "AGC", "AVP", "PSB", "ORF", "RIC", "ROA", "CRW", "EKN"]

module.exports = [
  ...westCoast,
  ...mountain,
  ...deepSouth,
  ...south,
  ...midwest,
  ...northeast
]
